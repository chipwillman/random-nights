function wwDrinkPlacesProvider() {
    var self = this;

    self.SearchNearby = function (aspects, latitude, longitude, radius, bounds, searchText, successCallback, failureCallback) {
        var searchCriteria = "&Latitude=" + latitude + "&Longitude=" + longitude + "&Range=" + radius;
        var wwDrinkSearch = "/api/Search?Query=" + searchText + searchCriteria;
        $.getJSON(wwDrinkSearch, function(data) {
            if (data && successCallback) {
                var results = [];
                for (var e in data.Establishments) {
                    var establishment = self.CreateEstablishment(data.Establishments[e]);
                    results.push(establishment);
                }
                successCallback(results);
            }
        });

    };
    
    self.wwDrinkSearchCallback = function (data) {
        try {
            if (data) {
                for (var e in data.Establishments) {
                    var establishment = self.CreateEstablishment(data.Establishments[e]);
                    if (self.EstablishmentsMap[establishment.google_id()]) {

                    } else {
                        self.EstablishmentsMap[establishment.google_id()] = establishment;
                        self.Establishments.unshift(establishment);
                        self.map.CreateMarker(establishment, self.RequestEstablishmentDetails);
                    }
                }
            }
            if (self.service != undefined) {
                self.service.SearchNearby(['bar'], self.latitude(), self.longitude(), self.bounds(), self.NearbySearchCallback, self.NearbySearchFailed);
            }
        } catch (e) {
            console.error(e.toString());
        }
        self.searching = false;
        clearTimeout(self.timout);
    };

    self.RequestEstablishmentDetails = function(establishment, successCallback, failureCallback) {
        var wwDrinkEstablishment = "/api/Establishment";
        var establishmentDetailsUrl = wwDrinkEstablishment + "/" + establishment.google_id();
        $.get(establishmentDetailsUrl, function (data) {
            if (data) {
                self.MapEstablishment(establishment, data);
                self.GetReviews(establishment);
            }
        }).error(function () {
            establishment.detailsRequested(true);
        });

    };
    
    self.LoadReview = function (establishment, reviewPk) {
        var establishmentReviewUrl = "/api/Review/" + reviewPk;
        $.get(establishmentReviewUrl, function (data) {
            if (data) {
                var review = self.MapEstablishmentReview(data);
                establishment.InsertReview(review);
            }
        });
    };

    self.MapEstablishmentReview = function (data) {
        var date = new Date(data.ReviewDate);
        var result = new Review();
        result.review(data.ReviewText);
        result.author(data.Profile.ScreenName);
        result.pk(data.ReviewPk);
        result.EstablishmentFk(data.ParentFk);
        result.date(date.toLocaleDateString());
        result.rating(data.Rating);
        for (var establishmentFeatureIndex in data.Aspects) {
            var aspectRating = data.Aspects[establishmentFeatureIndex];
            var reviewAspect = new ReviewAspect();
            reviewAspect.aspectType(aspectRating.Aspect.AspectName);
            reviewAspect.rating(aspectRating.Rating);
            result.aspects.push(reviewAspect);
        }
        return result;
    };

    self.GetReviews = function(establishment, successCallback, failureCallback) {
        var establishmentReviewUrl = "/api/Review?Parent=" + establishment.PK();
        $.get(establishmentReviewUrl, function (data) {
            if (data) {
                for (var reviewIndex in data) {
                    var review = self.MapEstablishmentReview(data[reviewIndex]);
                    establishment.InsertReview(review);
                }
            }
        });
    };

    //self.AddReview = function (establishment, reviewPk, successCallback, failureCallback) {
    //    var establishmentReviewUrl = "/api/Review/" + reviewPk;
    //    $.get(establishmentReviewUrl, function (data) {
    //        if (data) {
    //            var review = self.MapEstablishmentReview(data);
    //            establishment.InsertReview(review);
    //        }
    //    });
    //};

    self.MapEstablishment = function (result, establishment) {
        result.PK(establishment.EstablishmentPk);
        result.name(establishment.Name);
        result.address(establishment.Description);
        result.google_id(establishment.GoogleId);
        result.google_reference(establishment.GoogleReference);
        if (establishment.Location && establishment.Location.Geography && establishment.Location.Geography.WellKnownText) {
            var wellKnownText = establishment.Location.Geography.WellKnownText;
            var coords = wellKnownText.replace("POINT (", "").replace(")", "").split(" ");
            result.latitude(coords[1]);
            result.longitude(coords[0]);
        }
        if (establishment.OpenHours) {
            var hourParts = establishment.OpenHours.split('|');
            for (var openHour in hourParts) {
                result.open_hours().push({ open_hours: hourParts[openHour] });
            }
        }

        for (var image in establishment.Images) {
            result.AddPhoto(establishment.Images[image].ImageUrl);
        }

        return result;
    };
    
    self.DisplayEstablishmentDetails = function (establishmentPk, reviewPk, successCallback, failureCallback) {
        var wwDrinkEstablishment = "/api/Establishment";
        var establishmentDetailsUrl = wwDrinkEstablishment + "/" + establishmentPk;
        $.get(establishmentDetailsUrl, function (data) {
            if (data) {
                var establishment = self.CreateEstablishment(data);
                self.MapEstablishment(establishment, data);
                self.GetReviews(establishment);
                if (reviewPk) {
                    self.LoadReview(establishment, reviewPk);
                }
                if (successCallback != undefined) {
                    successCallback(establishment);
                }
            }
        }).error(function () {
            failureCallback();
        });
    };
    
    self.CreateEstablishment = function (establishment) {
        var result = new Establishment();
        result.PK(establishment.EstablishmentPk);
        result.source(true);
        if (establishment.Images) {
            for (var i in establishment.Images) {
                result.AddPhoto(establishment.Images[i].ImageUrl);
            }
        }
        return self.MapEstablishment(result, establishment);
    };

    self.PostEstablishment = function(establishment, features, openHours, photoUrls, successCallback, failureCallback) {
        var data = {
            PK: establishment.PK().toString(),
            details_requested: establishment.detailsRequested(),
            source: establishment.source(),
            name: establishment.name(),
            latitude: establishment.latitude(),
            longitude: establishment.longitude(),
            suburb: establishment.suburb(),
            open: establishment.open(),
            googleId: establishment.google_id(),
            googleReference: establishment.google_reference(),
            address: establishment.address(),
            features: features,
            openHours: openHours,
            photosUrls: photoUrls,
            rating: establishment.Rating(),
            addressStreetNumber: establishment.address_street_number,
            addressStreet: establishment.address_street,
            addressCity: establishment.address_city,
            addressState: establishment.address_state,
            addressCountry: establishment.address_country,
            addressPostCode: establishment.address_post_code
        };
        var wwDrinkEstablishment = "/api/Establishment";

        if (!establishment.source()) {
            $.post(wwDrinkEstablishment, data, function (data) {
                if (data) {
                    establishment.source(true);
                    establishment.PK(data.EstablishmentPk);
                }
                if (successCallback != undefined) {
                    successCallback(establishment);
                }
            })
            .error(function () {
                if (failureCallback != undefined) {
                    failureCallback(establishment);
                }
            });
        }
    };
    
    self.PostReview = function(establishment, features, openHours, photoUrls, successCallback, failureCallback) {
        if (establishment.ReviewText().length > 10) {
            var data = {
                PK: establishment.PK().toString(),
                details_requested: establishment.detailsRequested(),
                source: establishment.source(),
                name: establishment.name(),
                latitude: establishment.latitude(),
                longitude: establishment.longitude(),
                suburb: establishment.suburb(),
                open: establishment.open(),
                googleId: establishment.google_id(),
                googleReference: establishment.google_reference(),
                address: establishment.address(),
                features: features,
                openHours: openHours,
                photosUrls: photoUrls,
                rating: establishment.Rating(),
                addressStreetNumber: establishment.address_street_number,
                addressStreet: establishment.address_street,
                addressCity: establishment.address_city,
                addressState: establishment.address_state,
                addressCountry: establishment.address_country,
                addressPostCode: establishment.address_post_code
            };
            var wwDrinkEstablishment = "/api/Establishment";

            var wwDrinkReview = "/api/Review";

            if (establishment.source()) {
                $.ajax({
                    type: "PUT",
                    url: wwDrinkEstablishment + "/" + establishment.PK(),
                    data: data,
                    success: function(data) {
                        if (data != null) {
                            var review = {
                                pk: Guid.create().toString(),
                                reviewText: establishment.ReviewText(),
                                parentFk: establishment.PK().toString(),
                                rating: establishment.ReviewRating(),
                                features: establishment.GetEstablishmentFeatures(),
                                parentTable: "Establishment"
                            };
                            $.post(wwDrinkReview, review, function(data) {
                                if (data) {
                                    establishment.AddingReview(false);
                                    var review = self.MapEstablishmentReview(data);
                                    establishment.reviews.unshift(review);
                                }
                            });
                        }
                    }
                });
            } else {
                $.post(wwDrinkEstablishment, data, function(data) {
                    if (data) {
                        establishment.source(true);
                        establishment.PK(data.EstablishmentPk);
                        var review = {
                            pk: Guid.create().toString(),
                            reviewText: establishment.ReviewText(),
                            rating: establishment.ReviewRating(),
                            features: establishment.GetEstablishmentFeatures(),
                            parentFk: establishment.PK().toString(),
                            parentTable: "Establishment"
                        };
                        $.post(wwDrinkReview, review, function(data) {
                            if (data) {
                                establishment.AddingReview(false);
                                var review = self.MapEstablishmentReview(data);
                                establishment.reviews.unshift(review);
                            }
                        });
                    }
                });
            }
        }
    };
}