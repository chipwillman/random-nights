/** Converts numeric degrees to radians */
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    };
}

var availableAspects = [];
availableAspects.push("");
infowindow = new google.maps.InfoWindow();

function EstablishmentSearch() {
    var self = this;

    self.carouselConfig = {
        galleryid: 'establishments', //id of carousel DIV
        beltclass: 'belt', //class of inner "belt" DIV containing all the panel DIVs
        panelclass: 'panel', //class of panel DIVs each holding content
        autostep: { enable: true, moveby: 1, pause: 3000 },
        panelbehavior: { speed: 500, wraparound: false, wrapbehavior: 'slide', persist: true },
        defaultbuttons: { enable: true, moveby: 1, leftnav: ['/Images/bullet.png', -15, 80], rightnav: ['/Images/bullet.png', -50, 80] },
        statusvars: ['statusA', 'statusB', 'statusC'], //register 3 variables that contain current panel (start), current panel (last), and total panels
        contenttype: ['inline'] //content setting ['inline'] or ['ajax', 'path_to_external_file']
    };

    self.LocationChanged = ko.observable(true);
    self.searchText = ko.observable();
    self.searchText.subscribe(function() {
        self.LocationChanged(true);
    });

    self.Establishments = ko.observableArray();

    self.RadarResults = ko.observableArray();

    self.Interests = ko.observableArray();

    self.country_name = ko.observable("");
    self.country_code = ko.observable("");
    self.city = ko.observable("");
    self.ip_address = ko.observable();
    self.latitude = ko.observable();
    self.longitude = ko.observable();
    self.radius = ko.observable(500);
    self.bounds = ko.observable();

    //self.latitude("-37.7949955");
    //self.longitude("144.92515895");
    //self.searchText("Kensington, Australia");

    self.carousel = new Stepcarousel();
    self.carouselLoaded = false;

    self.IsMacUser = ko.observable(navigator.platform != "Win32");
    self.IsWindowsUser = ko.observable(navigator.platform == "Win32");

    self.ParseHostLookup = function(data) {
        var hostipInfo = data.split("\n");
        for (i = 0; hostipInfo.length >= i; i++) {
            try {
                info_part = hostipInfo[i].split(":");
                if (info_part[0] == "IP") self.ip_address(info_part[1].trim());
                if (info_part[0] == "City") {
                    if (info_part[1] != " (Unknown city)" && info_part[1] != " (Unknown City?)") {
                        self.city(info_part[1].trim());
                    }
                }
                if (info_part[0] == "Country") {
                    if (info_part[1] != " (Unknown Country?) (XX)") {
                        self.country_name(info_part[1].trim());
                    }
                }
                if (info_part[0] == "Latitude") {
                    self.latitude(info_part[1].trim());
                }
                if (info_part[0] == "Longitude") {
                    self.longitude(info_part[1].trim());
                }
            } catch (e) {
            }
        }
    };

    self.init_location = function() {
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        
        $.get("http://api.hostip.info/get_html.php?position=true", function (data) {
            self.ParseHostLookup(data);

            if (self.country_name != "") {
                if (self.city() != "") {
                    self.searchText(self.city() + ", " + self.country_name());
                    self.radius(1500);
                } else {
                    self.searchText(self.country_name());
                    self.radius(20000);
                }
                
                self.initializeGoogleAndSearch(self);
            }
        });
    };

    self.googleInitialized = false;

    self.initializeGoogleAndSearch = function () {
        if (!self.googleInitialized) {
            self.googleInitialized = true;
            self.init_google();
            if (currentReview != "") {
                self.DisplayReview(currentEstablishment, currentReview);
            } else if (currentEstablishment != "") {
                self.DisplayEstablishment(currentEstablishment);
            } else if (self.latitude() != null) {
                self.map.GeocodeAddress(self.searchText(), self.LocationFound, self.LocationNotFound);
            }
        }
    };

    if (self.latitude() == null) {
        self.init_location();
    }

    self.timeout = null;

    self.CancelDelayedSearch = function() {
        if (self.timeout != null) {
            clearTimeout(self.timeout);
            self.timeout = null;
        } 
    };

    self.DelayedSearch = function () {
        if (self.timeout == null) {
            self.Search();
        }
    };

    self.init_google = function () {
        self.map = new GoogleMapProvider();
        self.map.initializeMapProvider(self.latitude(), self.longitude(), self.DelayedSearch);

        self.service = new GooglePlacesProvider(self.map.googleMap);
    };

    self.AddRadarHit = function(radarHit) {
        var establishment = new Establishment(function (establishmentb) {
            self.ShowDetails(establishmentb);
        });
        establishment.google_reference(radarHit.reference);
        self.RadarResults.push(establishment);
    };

    self.AddEstablishment = function (place) {
        var establishment;
        if (self.EstablishmentsMap[place.id]) {
            establishment = self.EstablishmentsMap[place.id];
        } else {
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
            self.Establishments.push(establishment);
            self.Establishments.sort(function (a, b) { return b.Rating() - a.Rating(); });
            self.map.CreateMarker(establishment, self.RequestEstablishmentDetails);
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

    self.CloseTab = function() {
        var establishment = this;

        var tabId = 'a[href$="' + establishment.tab_href() + '"]:first';
        if ($(tabId).parent().parent().parent().hasClass("ui-tabs-selected")) {
            $('a[href$="#results_tabs-0"]:first').click();
        }

        self.Interests.remove(establishment);
    };

    self.NearbySearchCallback = function(results, status) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            self.AddEstablishment(place);
        }
        self.UpdateCarousel();
        self.searching = false;
    };

    self.NearbySearchFailed = function() {

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

    self.establishmentIndex = 0;

    self.SelectEstablishment = function (establishment) {
        establishment.ShowInfoWindow();
    };

    self.ShowDetails = function(establishment) {
        establishment.index(self.establishmentIndex++);
        var elementName = "results_tabs-" + (establishment.index() + 1).toString();
        establishment.tab_href("#" + elementName);
        establishment.tab_name(elementName);
        self.Interests.unshift(establishment);
        
        $(function () {
            var options = { active: establishment.index() + 1 };
            var resultsTabs = $("#results_tabs");
            resultsTabs.tabs('destroy');
            resultsTabs.tabs(options);
            $('a[href$="' + establishment.tab_href() + '"]:first').click();
        });
    };

    self.GetReviews = function(establishment) {
        var establishmentReviewUrl = "/api/Review?Parent=" + establishment.PK();
        $.get(establishmentReviewUrl, function(data) {
            if (data) {
                for (var reviewIndex in data) {
                    var review = self.MapEstablishmentReview(data[reviewIndex]);
                    establishment.AddReview(review);
                }
            }
        });
    };

    self.LoadReview = function(establishment, reviewPk) {
        var establishmentReviewUrl = "/api/Review/" + reviewPk;
        $.get(establishmentReviewUrl, function (data) {
            if (data) {
                var review = self.MapEstablishmentReview(data);
                establishment.InsertReview(review);
            }
        });
    };

    self.RequestDetailsSuccess = function(establishment) {

    };

    self.RequestDetailsFailed = function(establishment) {

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
                self.service.RequestGoogleDetails(establishment, self.RequestDetailsSuccess, self.RequestDetailsFailure);
            }
        }).error(function() {
            establishment.detailsRequested(true);
            self.service.RequestGoogleDetails(establishment, self.RequestDetailsSuccess, self.RequestDetailsFailure);
        });
    };

    self.SelectEstablishmentClick = function () {
        var establishment = this;
        if (!$('a[href$="#results_tabs-0"]:first').parent().parent().hasClass("ui-tabs-selected")) {
            self.ShowDetails(establishment);
        } else {
            self.SelectEstablishment(establishment);
        }
        if (!establishment.detailsRequested()) {
            self.RequestEstablishmentDetails(establishment);
        }
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

    self.LocationNotFound = function() {

    };

    self.LocationFound = function (latitude, longitude, radius, bounds) {
        self.latitude(latitude);
        self.longitude(longitude);
        self.radius(radius);
        self.bounds(bounds);
        self.Search();
    };

    self.SearchClick = function() {
        var searchString = self.searchText();
        if (self.LocationChanged()) {
            self.map.GeocodeAddress(searchString);
        } else {
            self.Search();
        }
    };

    self.EstablishmentsMap = {};

    self.CreateEstablishment = function(establishment) {
        var result = new Establishment(function (establishmentb) {
            self.ShowDetails(establishmentb);
        });
        result.PK(establishment.EstablishmentPk);
        result.source(true);
        if (establishment.Images) {
            for (var i in establishment.Images) {
                result.AddPhoto(establishment.Images[i].ImageUrl);
            }
        }
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

    self.searching = false;

    self.Search = function () {
        if (!self.searching) {
            self.searching = true;
            if (self.timeout != undefined) {
                clearTimeout(self.timout);
            }
            self.timout = setTimeout(function () { self.searching = false; }, 5000);

            if (self.map != undefined) {
                self.map.clearOverlays();
                self.latitude(self.map.latitude());
                self.longitude(self.map.longitude());
                self.bounds(self.map.bounds());
                self.radius(self.map.radius());
            }
            
            self.EstablishmentsMap = {};
            self.Establishments.removeAll();
           
            var wwDrinkSearch = "/api/Search?Query=" + self.searchText() + self.SearchCriteria();
            $.getJSON(wwDrinkSearch, self.wwDrinkSearchCallback);
        }
    };

    self.DisplayEstablishmentDetails = function(establishmentPk, reviewPk) {
        var wwDrinkEstablishment = "/api/Establishment";
        var establishmentDetailsUrl = wwDrinkEstablishment + "/" + establishmentPk;
        $.get(establishmentDetailsUrl, function(data) {
            if (data) {
                var establishment = self.CreateEstablishment(data);
                self.MapEstablishment(establishment, data);
                self.GetReviews(establishment);
                if (reviewPk) {
                    self.LoadReview(establishment, reviewPk);
                }
                self.ShowDetails(establishment);
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

    self.DisplayReview = function(establishmentPk, reviewPk) {
        self.DisplayEstablishmentDetails(establishmentPk, reviewPk);
    };

    self.DisplayEstablishment = function(establishmentPk) {
        self.DisplayEstablishmentDetails(establishmentPk, null);
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

    self.AddReviewClick = function () {
        var establishment = this;

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
                features: self.GetFeatures(establishment),
                openHours: self.GetOpenHours(establishment),
                photosUrls: self.GetPhotos(establishment),
                rating: establishment.Rating(),
                addressStreetNumber: establishment.address_street_number,
                addressStreet : establishment.address_street,
                addressCity : establishment.address_city,
                addressState : establishment.address_state,
                addressCountry : establishment.address_country,
                addressPostCode : establishment.address_post_code
            };
            var wwDrinkEstablishment = "/api/Establishment";

            var wwDrinkReview = "/api/Review";

            if (this.source()) {
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

    self.init_autocomplete = function() {
        $.getJSON("/api/Aspect/", function (data) {
            
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var aspect = data[i];
                    availableAspects.push(aspect.AspectName);
                }
            }
        });
    };
}



