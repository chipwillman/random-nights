/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
}

function EstablishmentSearch() {
    var self = this;

    self.carouselConfig = {
        galleryid: 'establishments', //id of carousel DIV
        beltclass: 'belt', //class of inner "belt" DIV containing all the panel DIVs
        panelclass: 'panel', //class of panel DIVs each holding content
        autostep: { enable: true, moveby: 1, pause: 3000 },
        panelbehavior: { speed: 500, wraparound: false, wrapbehavior: 'slide', persist: true },
        defaultbuttons: { enable: true, moveby: 1, leftnav: ['/Images/back_arrow.png', -15, 80], rightnav: ['/Images/forward_arrow.png', -50, 80] },
        statusvars: ['statusA', 'statusB', 'statusC'], //register 3 variables that contain current panel (start), current panel (last), and total panels
        contenttype: ['inline'] //content setting ['inline'] or ['ajax', 'path_to_external_file']
    };

    self.LocationChanged = ko.observable(false);
    self.searchText = ko.observable();
    self.searchText.subscribe(function() {
        self.LocationChanged(true);
    });

    self.Establishments = ko.observableArray();

    self.RadarResults = ko.observableArray();

    self.Interests = ko.observableArray();

    self.country_name = ko.observable();
    self.country_code = ko.observable();
    self.city = ko.observable();
    self.ip_address = ko.observable();
    self.latitude = ko.observable();
    self.longitude = ko.observable();
    self.radius = ko.observable();
    self.bounds = ko.observable();

    self.latitude("-37.7949955");
    self.longitude("144.92515895");
    self.searchText("Kensington, Australia");
    self.radius(500);

    self.service = ko.observable();
    self.infowindow = ko.observable();
    self.Listeners = new ko.observableArray();

    self.carousel = new Stepcarousel();
    self.carouselLoaded = false;

    self.IsMacUser = ko.observable(navigator.platform != "Win32");
    self.IsWindowsUser = ko.observable(navigator.platform == "Win32");

    self.init_location = function() {
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        
        $.get("http://api.hostip.info/get_html.php?position=true", function(data) {
            var hostipInfo = data.split("\n");
            for (i = 0; hostipInfo.length >= i; i++) {
                try {
                    info_part = hostipInfo[i].split(":");
                    if (info_part[0] == "IP") self.ip_address(info_part[1]);
                    if (info_part[0] == "City") {
                        self.city(info_part[1]);
                        self.searchText(info_part[i] + ", " + self.country_name());
                    }
                    if (info_part[0] == "Country") {
                        self.country_name(info_part[1]);
                    }
                    if (info_part[0] == "Latitude") {
                        self.latitude(info_part[1]);
                    }
                    if (info_part[0] == "Longitude") {
                        self.longitude(info_part[1]);
                    }
                } catch(e) {
                }
            }
        });

        //$.getJSON("http://api.hostip.info/get_json.php&position=true", function (data) {
        //    self.country_code(data.country_code);
        //    self.country_name(data.country_name);
        //    self.city(data.city);
        //    self.ip_address(data.ip);
        //    self.latitude(data.latitude);
        //    self.longitude(data.longitude);
        //});

    };

    if (self.latitude() == null) {
        self.init_location();
    }

    self.init_google = function() {
        var currentLocation = new google.maps.LatLng(self.latitude(), self.longitude());

        self.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: currentLocation,
            zoom: 15
        });
        self.geocoder = new google.maps.Geocoder();
        google.maps.event.addListener(self.map, 'dragend', function() {
            self.Search();
        });
        google.maps.event.addListener(self.map, 'zoom_changed', function () {
            self.Search();
        });
        
        self.infowindow(new google.maps.InfoWindow());
        self.service(new google.maps.places.PlacesService(self.map));
    };

    self.AddRadarHit = function(radarHit) {
        var establishment = new Establishment();
        establishment.google_reference(radarHit.reference);

        // self.RequestEstablishmentDetails(establishment);
        // self.Establishments.push(establishment);
        // self.CreateMarker(radarHit.geometry.location);
        // self.UpdateCarousel();
        
        self.RadarResults.push(establishment);
    };

    self.AddEstablishment = function (place) {
        if (self.EstablishmentsMap[place.id]) {
            var establishment = self.EstablishmentsMap[place.id];

            //if (!self.Establishments().contains(establishment)) {
            //    self.Establishments.unshift(establishment);
            //}
        } else {
            var establishment = new Establishment();
            establishment.PK(Guid.create());
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
            self.Establishments.push(establishment);
            self.CreateMarker(place.name, place.geometry.location);
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
        } catch(e) {

        }
    };

    self.clearOverlays = function() {
        for (var i = 0; i < self.Listeners().length; i++) {
            self.Listeners()[i].setMap(null);
        }
        self.Listeners.removeAll();
    };

    self.CloseTab = function() {
        var establishment = this;

        var tabId = 'a[href$="' + establishment.tab_href() + '"]:first';
        if ($(tabId).parent().parent().parent().hasClass("ui-tabs-selected")) {
            $('a[href$="#results_tabs-0"]:first').click();
        }

        self.Interests.remove(establishment);
    };

    self.CreateMarker = function (name, placeLoc) {
        var marker = new google.maps.Marker({
            map: self.map,
            position: placeLoc
        });

        self.Listeners.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
            self.infowindow().setContent(name);
            self.infowindow().open(self.map, this);
        });
    };

    self.NearbySearchCallback = function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                self.AddEstablishment(place);
            }
            self.UpdateCarousel();
            self.SearchGoogleRadar();
            self.searching = false;
        }
    };

    self.UpdateCarousel = function() {
        try {
            if (self.carouselLoaded) {
                self.carousel.unload(self.carouselConfig);
            }
            self.carouselLoaded = true;
            self.carousel.setup(self.carouselConfig);
            self.StepFirst();
        } catch(e) {

        }
    };

    self.RadarSearchCallback = function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            self.RadarResults.removeAll();
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                self.AddRadarHit(place);
            }
        }
    };

    self.ParseOpenHours = function(openingHours) {
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

    self.establishmentIndex = 0;

    self.SelectEstablishment = function (establishment) {
        establishment.index(self.establishmentIndex++);
        var elementName = "results_tabs-" + (establishment.index() + 1).toString();
        establishment.tab_href("#" + elementName);
        establishment.tab_name(elementName);
        self.Interests.unshift(establishment);
        $('.rateit').rateit();

        return (establishment.open_hours().length == 0 && establishment.features().length == 0 && !establishment.detailsRequested());
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

    self.GetReviews = function(establishment) {
        var establishmentReviewUrl = "/api/Review?Parent=" + establishment.PK();
        $.get(establishmentReviewUrl, function(data) {
            if (data) {
                for (var reviewIndex in data) {
                    var review = new Review();
                    var date = new Date(data[reviewIndex].ReviewDate);
                    review.review(data[reviewIndex].ReviewText);
                    review.author(data[reviewIndex].Profile.UserName);
                    review.date(date.toLocaleDateString());
                    
                    establishment.reviews.push(review);
                }
            }
        });
    };

    self.RequestEstablishmentDetails = function (establishment) {
        var wwDrinkEstablishment = "/api/Establishment";
        var establishmentDetailsUrl = wwDrinkEstablishment + "/" + establishment.google_id();
        $.get(establishmentDetailsUrl, function (data) {
            if (data) {
                self.MapEstablishment(establishment, data);
                self.GetReviews(establishment);
            }
                
            if (!establishment.detailsRequested()) {
                establishment.detailsRequested(true);
                self.RequestGoogleDetails(establishment);
            }
        }).error(function() {
            establishment.detailsRequested(true);
            self.RequestGoogleDetails(establishment);
        });
    };

    self.ParseUnixDate = function(time) {
        var date = new Date(time*1000);
        return date.toLocaleDateString();
    };

    self.RequestGoogleDetails = function(establishment) {
        var request = {
            reference: establishment.google_reference()
        };
        self.service().getDetails(request, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                self.MapAddress(establishment, place);
                var i;
                for (i = 0; i < place.types.length; i++) {
                    establishment.features.push({ name: place.types[i] });
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
                            reviewAspect.aspectBackingId('reviewAspectRating' + aspectRatingIndex);
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
            }
        });
    };

    self.SelectEstablishmentClick = function() {
        var establishment = this;
        self.SelectEstablishment(establishment);
        self.RequestEstablishmentDetails(establishment);

        $(function() {
            var options = { active: establishment.index() + 1 };
            var resultsTabs = $("#results_tabs");
            resultsTabs.tabs('destroy');
            resultsTabs.tabs(options);
            $('a[href$="' + establishment.tab_href() + '"]:first').click();
        });
    };

    self.StepBack = function() {
        if (self.carousel) {
            self.carousel.stepBy('establishments', -1);
        }
    };

    self.StepFirst = function() {
        if (self.carousel) {
            self.carousel.stepTo('establishments', 1);
        }
    };

    self.StepForward = function() {
        if (self.carousel) {
            self.carousel.stepBy('establishments', 1);
        }
    };

    self.StepLast = function() {
        if (self.carousel) {
            self.carousel.stepTo('establishments', this.Establishments().length - 1);
        }
    };

    self.SearchCriteria = function() {
        if (self.latitude() == "undefined" && self.bounds())
            return "&" + "ne=" + self.bounds().getNorthEast() + "&" + "sw=" + self.bounds().getSouthWest();
        else {
            return "&Latitude=" + self.latitude() + "&Longitude=" + self.longitude() + "&Range=" + self.radius();
        }
    };

    self.SearchClick = function() {
        var searchString = self.searchText();
        self.clearOverlays();

        if (self.LocationChanged()) {
            self.geocoder.geocode({ 'address': searchString }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0].geometry.location) {
                        self.map.setCenter(results[0].geometry.location);
                        self.latitude(results[0].geometry.location.lat());
                        self.longitude(results[0].geometry.location.lng());
                    } else {
                        self.latitude(null);
                        self.longitude(null);
                    }
                    if (results[0].geometry.bounds) {
                        self.bounds(results[0].geometry.bounds);
                        if (self.latitude() == null) {
                            self.latitude(results[0].geometry.bounds.getCenter().lat());
                        }
                        if (self.longitude() == null) {
                            self.longitude(results[0].geometry.bounds.getCenter().lng());
                        }
                        var radius = self.GetDistanceInMeters(results[0].geometry.bounds.getNorthEast().lat(), results[0].geometry.bounds.getSouthWest().lat(), results[0].geometry.bounds.getNorthEast().lng(), results[0].geometry.bounds.getSouthWest().lat);
                        if (radius > 5000.0) {
                            radius = 5000.0;
                        } else {
                            self.map.fitBounds(results[0].geometry.bounds);
                        }
                        self.radius(radius);
                    } else {
                        self.bounds(null);
                    }
                    self.Search();
                }
            });
        } else {
            self.Search();
        }
    };

    self.GetDistanceInMeters = function(lat1, lat2, lon1, lon2) {
        var R = 6371; // km
        var dLat = (lat2 - lat1).toRad();
        var dLon = (lon2 - lon1).toRad();
        var lat1r = lat1.toRad();
        var lat2r = lat2.toRad();

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1r) * Math.cos(lat2r);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return (d * 1000) / 2;
    };

    self.GetSearchRequest = function(types) {
        var request;
        if (self.bounds() != null) {
            request = {
                bounds: self.bounds(),
                types: types
            };
        } else {
            var currentLocation = new google.maps.LatLng(self.latitude(), self.longitude());
            request = {
                location: currentLocation,
                radius: '5000',
                types: types
            };
        }
        return request;
    };

    self.SearchGoogleRadar = function() {
        var request = self.GetSearchRequest(['bar']);
        self.service().radarSearch(request, self.RadarSearchCallback);
    };

    self.SearchGoogleNearby = function() {
        var request = self.GetSearchRequest(['bar']);
        self.service().nearbySearch(request, self.NearbySearchCallback);
    };

    self.EstablishmentsMap = {};

    self.CreateEstablishment = function(establishment) {
        var result = new Establishment();
        result.PK(establishment.EstablishmentPk);
        result.source(true);
        return self.MapEstablishment(result, establishment);
    };

    self.MapEstablishment = function(result, establishment) {
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
    
    self.wwDrinkSearchCallback = function(data) {
        try {
            if (data) {
                for (var e in data.Establishments) {
                    var establishment = self.CreateEstablishment(data.Establishments[e]);
                    if (self.EstablishmentsMap[establishment.google_id()]) {
                        
                    } else {
                        self.EstablishmentsMap[establishment.google_id()] = establishment;
                        self.Establishments.unshift(establishment);
                        var establishmentLocation = new google.maps.LatLng(establishment.latitude(), establishment.longitude());
                        self.CreateMarker(establishment.name(), establishmentLocation);
                    }
                }
            }
            self.SearchGoogleNearby();
        } catch (e) {
            console.error(e.toString());
        }
    };

    self.searching = false;

    self.Search = function () {
        if (!self.searching) {
            self.searching = true;
            setTimeout(function () { self.searching = false; }, 2000);
            
            self.latitude(self.map.getCenter().lat());
            self.longitude(self.map.getCenter().lng());
            self.bounds(self.map.getBounds());
            self.clearOverlays();
            var wwDrinkSearch = "/api/Search?Query=" + self.searchText() + self.SearchCriteria();
            self.EstablishmentsMap = {};
            self.Establishments.removeAll();
            $.getJSON(wwDrinkSearch, self.wwDrinkSearchCallback);
        }
    };

    self.ReviewText = ko.observable();

    self.GetFeatures = function(establishment) {
        var result = [];
        for (var i = 0; i < establishment.features().length; i++) {
            var feature = establishment.features()[i];
            result.push(feature.name);
        }
        return result;
    };

    self.GetOpenHours = function(establishment) {
        var result = [];
        for (var i = 0; i < establishment.open_hours().length; i++) {
            var openHour = establishment.open_hours()[i];
            result.push(openHour.open_hours());
        }
        return result;
    };

    self.GetPhotos = function(establishment) {
        var result = [];
        for (var i = 0; i < establishment.photos().length; i++) {
            var photo = establishment.photos()[i];
            result.push({ imageUrl: photo.imageUrl });
        }
        return result;
    };


    self.AddReviewClick = function() {
        var establishment = this;
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
            features: self.GetFeatures(establishment),
            openHours: self.GetOpenHours(establishment),
            photosUrls: self.GetPhotos(establishment),
            rating: establishment.Rating()
        };
        var wwDrinkEstablishment = "/api/Establishment";

        var wwDrinkReview = "/api/Review";

        if (this.source()) {
            $.ajax({
                type: "PUT",
                url: wwDrinkEstablishment + "/" + establishment.PK(),
                data: data,
                success: function (data) {
                    if (data) {
                        var review = {
                            pk: Guid.create().toString(),
                            reviewText: establishment.ReviewText(),
                            parentFk: establishment.PK().toString(),
                            parentTable: "Establishment"
                        };
                        $.post(wwDrinkReview, review, function (data) {
                            if (data) {
                                var date = new Date(data.ReviewDate);
                                establishment.AddingReview(false);
                                var review = new Review();
                                review.review(data.ReviewText);
                                review.author(data.Profile.UserName);
                                review.date(date.toLocaleDateString());
                                establishment.reviews.unshift(review);
                            }
                        });
                    }
                }
            });
        } else {
            $.post(wwDrinkEstablishment, data, function (data) {
                if (data) {
                    establishment.source(true);
                    establishment.PK(data.EstablishmentPk);
                    var review = {
                        pk: Guid.create().toString(),
                        reviewText: establishment.ReviewText(),
                        rating: establishment.Rating(),
                        parentFk: establishment.PK().toString(),
                        parentTable: "Establishment"
                    };
                    $.post(wwDrinkReview, review, function (data) {
                        if (data) {
                            var date = new Date(data.ReviewDate);
                            establishment.AddingReview(false);
                            var review = new Review();
                            review.review(data.ReviewText);
                            review.author(data.Profile.UserName);
                            review.date(date.toLocaleDateString());
                            establishment.reviews.unshift(review);
                        }
                    });
                }
            });
        }
    };
}



