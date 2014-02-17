function GooglePlacesProvider(googleMap) {
    var self = this;
    self.service = new google.maps.places.PlacesService(googleMap);

    self.GetSearchRequest = function (types, latitude, radius, longitude, bounds) {
        var request;
        if (bounds != null) {
            request = {
                bounds: bounds,
                types: types
            };
        } else {
            var location = new google.maps.LatLng(latitude, longitude);
            request = {
                location: location,
                radius: radius,
                types: types
            };
        }
        return request;
    };

    self.MapGooglePlaceToEstablishment = function (place) {
        var establishment;
        establishment = new Establishment(function (establishmentb) {
            self.ShowDetails(establishmentb);
        });
        establishment.PK(Guid.create());
        establishment.Rating(place.rating);
        establishment.name(place.name);
        establishment.google_id(place.id);
        establishment.google_reference(place.reference);
        if (place.photos && place.photos.length > 0) {
            var url = place.photos[0].getUrl({ 'maxWidth': 240, 'maxHeight': 180 });
            establishment.imageUrl(url);
        } else {
            establishment.imageUrl("/Images/missing_establishment_image.png");
        }

        try {
            establishment.latitude(place.geometry.location.lat());
            establishment.longitude(place.geometry.location.lng());
        } catch (e) {

        }

        try {
            var suburb = place.vicinity.split(', ');
            if (suburb.length == 2) {
                establishment.suburb(suburb[1]);
            } else if (suburb.length == 1) {
                establishment.suburb(suburb[0]);
            }
            if (place.opening_hours) {
                establishment.open(place.opening_hours.open_now);
            } else {
                establishment.open(false);
            }
        } catch (e) {

        }
        return establishment;
    };

    self.MapGoogleResults = function (places) {
        var results = [];
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            results.push(self.MapGooglePlaceToEstablishment(place));
        }
        return results;
    };

    self.SearchNearby = function (aspects, latitude, longitude, radius, bounds, searchText, searchCallback, failureCallback) {
        var request = self.GetSearchRequest(aspects, latitude, radius, longitude, bounds);
        self.service.nearbySearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                var establishments = self.MapGoogleResults(results);
                searchCallback(establishments, status);
            } else {
                failureCallback();
            }
        });
    };

    self.MapAddress = function (establishment, place) {
        establishment.address(place.formatted_address);
        establishment.address_street_number = ko.observable();
        establishment.address_street = ko.observable();
        establishment.address_city = ko.observable();
        establishment.address_state = ko.observable();
        establishment.address_country = ko.observable();
        establishment.address_post_code = ko.observable();
    };

    self.RequestEstablishmentDetails = function (establishment, successCallback, failureCallback) {
        var request = {
            reference: establishment.google_reference()
        };
        self.service.getDetails(request, function (place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                self.MapAddress(establishment, place);
                if (!establishment.source() || establishment.Rating() == 0) {
                    establishment.Rating(place.rating);
                }
                establishment.WebSite(place.website);
                var i;
                for (i = 0; i < place.types.length; i++) {
                    if (place.types[i] != "establishment") {
                        var feature = new EstablishmentFeature();

                        feature.Name(place.types[i]);
                        establishment.features.push(feature);
                    }
                }
                if (place.reviews) {
                    for (i = 0; i < place.reviews.length; i++) {
                        var userReview = new Review();
                        var reviewText = unescape(place.reviews[i].text).replace(/&#39\;/g, "'").replace(/&quot;/g, "'");
                        userReview.review(reviewText);
                        userReview.author(place.reviews[i].author_name);
                        userReview.rating(place.reviews[i].rating);
                        userReview.authorUrl(place.reviews[i].author_url);
                        userReview.date(self.ParseUnixDate(place.reviews[i].time));
                        for (var aspectRatingIndex in place.reviews[i].aspects) {
                            var aspectRating = place.reviews[i].aspects[aspectRatingIndex];
                            var reviewAspect = new ReviewAspect();
                            reviewAspect.aspectType(aspectRating.type);
                            reviewAspect.rating(aspectRating.rating);
                            userReview.aspects.push(reviewAspect);
                        }

                        establishment.AddReview(userReview);
                    }
                }
                if (place.photos) {
                    for (i = 0; i < place.photos.length; i++) {
                        var url = place.photos[i].getUrl({ 'maxWidth': 240, 'maxHeight': 180 });
                        establishment.AddPhoto(url);
                    }
                }
                establishment.open_hours(self.ParseOpenHours(place.opening_hours));
                if (successCallback != undefined) {
                    successCallback(establishment);
                }
            } else {
                if (failureCallback != undefined) {
                    failureCallback(establishment);
                }
            }
        });
    };

    self.SearchGoogleRadar = function () {
        var request = self.GetSearchRequest(['bar']);
        self.service().radarSearch(request, self.RadarSearchCallback);
    };

    self.RadarSearchCallback = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.RadarResults.removeAll();
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                self.AddRadarHit(place);
            }
        }
    };
    
    self.ParseUnixDate = function (time) {
        var date = new Date(time * 1000);
        return date.toLocaleDateString();
    };
    
    self.ParseOpenHours = function (openingHours) {
        var result = [];
        var previous = new OpenHours();
        if (openingHours && openingHours.periods) {
            for (var i = 0; i < openingHours.periods.length; i++) {
                var period = openingHours.periods[i];
                var hours = new OpenHours();
                hours.start_day_begin(period.open.day);
                hours.start_day_end(period.open.day);
                hours.start_hour(period.open.hours);
                hours.start_minute(period.open.minutes);

                if (period.close) {
                    hours.end_day_begin(period.close.day);
                    hours.end_day_end(period.close.day);
                    hours.end_hour(period.close.hours);
                    hours.end_minute(period.close.minutes);
                }
                hours.start_day_begin(period.open.day);
                if (result.length == 0 || (previous.start_hour() == hours.start_hour() && previous.start_minute() == hours.start_minute() &&
                    previous.end_hour() == hours.end_hour() && previous.end_minute() == hours.end_minute())) {
                    if (result.length == 0) {
                        result.push(hours);
                        previous = hours;
                    } else {
                        previous.end_day_end(hours.end_day_end());
                        previous.start_day_end(hours.start_day_end());
                    }
                } else {
                    result.push(hours);
                    previous = hours;
                }
            }
        }
        return result;
    };
}