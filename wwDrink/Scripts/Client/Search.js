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

    self.RequestDetail = ko.computed(function() {
        var result = 0;
        for (var i in self.Establishments()) {
            var establishment = self.Establishments()[i];
            if (!establishment.source()) {
                result++;
            }
        }
        return result;
    });

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

    self.carousel = new Stepcarousel();
    self.carouselLoaded = false;

    self.IsMacUser = ko.observable(navigator.platform != "Win32");
    self.IsWindowsUser = ko.observable(navigator.platform == "Win32");

    self.service = [];
    self.service.push(new wwDrinkPlacesProvider());

    self.ParseHostLookup = function(data) {
        var hostipInfo = data.split("\n");
        for (var i = 0; hostipInfo.length >= i; i++) {
            try {
                var infoPart = hostipInfo[i].split(":");
                if (infoPart[0] == "IP") self.ip_address(infoPart[1].trim());
                if (infoPart[0] == "City") {
                    if (infoPart[1] != " (Unknown city)" && infoPart[1] != " (Unknown City?)") {
                        self.city(infoPart[1].trim());
                    }
                }
                if (infoPart[0] == "Country") {
                    if (infoPart[1] != " (Unknown Country?) (XX)") {
                        self.country_name(infoPart[1].trim());
                    }
                }
                if (infoPart[0] == "Latitude") {
                    self.latitude(infoPart[1].trim());
                }
                if (infoPart[0] == "Longitude") {
                    self.longitude(infoPart[1].trim());
                }
            } catch (e) {
            }
        }
    };

    self.init_location = function() {
        $.get("http://api.hostip.info/get_html.php?position=true", function (data) {
            self.ParseHostLookup(data);

            if (self.country_name != "") {
                if (self.city() != "") {
                    self.searchText(self.city() + ", " + self.country_name());
                    self.radius(1500);
                } else {
                    self.ShowRandomCity();
                }
                self.map.CenterMap(self.latitude(), self.longitude(), self.radius());

                self.initializeGoogleAndSearch(self);
            }
        });
    };

    self.providersInitialized = false;

    self.initializeGoogleAndSearch = function () {
        if (!self.providersInitialized) {
            self.providersInitialized = true;
            self.init_google();
        }
        
        if (currentReview != "") {
            self.DisplayReview(currentEstablishment, currentReview);
        } else if (currentEstablishment != "") {
            self.DisplayEstablishment(currentEstablishment);
        } else if (self.latitude() == undefined) {
            self.map.GeocodeAddress(self.searchText(), self.LocationFound, self.LocationNotFound);
        } else if (self.latitude() != undefined) {
            self.Search();
        }
    };

    //if (self.latitude() == null) {
    //    self.init_location();
    //}

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

        self.service.push(new GooglePlacesProvider(self.map.googleMap));
    };

    self.CloseTab = function() {
        var establishment = this;

        var tabId = 'a[href$="' + establishment.tab_href() + '"]:first';
        if ($(tabId).parent().parent().parent().hasClass("ui-tabs-selected")) {
            $('a[href$="#results_tabs-0"]:first').click();
        }

        self.Interests.remove(establishment);
    };

    self.RequestEstablishmentDetailsQueue = [];
    self.timeoutId = 0;

    self.NearbySearchCallback = function (establishments, status) {
        if (status == undefined) {
            clearTimeout(self.timeoutId);
        }
        
        for (var i in establishments) {
            var establishment = establishments[i];
            if (self.EstablishmentsMap[establishment.google_id()]) {
                self.EstablishmentsMap[establishment.google_id()].MapEstablishment(establishment);
            } else {
                establishment.SelectEstablishmentCallback = self.ShowDetails;
                self.Establishments.push(establishment);
                self.Establishments.sort(function (a, b) { return b.Rating() - a.Rating(); });
                self.EstablishmentsMap[establishment.google_id()] = establishment;
                self.map.CreateMarker(establishment, self.RequestEstablishmentDetails);
            }
        }

        self.UpdateCarousel();

        if (status == undefined) {
            clearTimeout(self.searchingTimout);
            self.searching = false;
        }

        if (status == undefined) {
            clearTimeout(self.timeoutId);
            self.timeoutId = setTimeout(self.LookForEstablishmentDetails, 2000);
        }
    };

    self.LookForEstablishmentDetails = function () {
        clearTimeout(self.timeoutId);
        for (var i in self.Establishments()) {
            var establishment = self.Establishments()[i];
            if (!establishment.source() && !establishment.detailsRequested()) {
                self.RequestEstablishmentDetails(establishment);
                self.timeoutId = setTimeout(self.LookForEstablishmentDetails, 1000);
                return;
            }
        }
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
        document.title = establishment.name() + " at wwDrink";
        document.URL = establishment.EstablishmentLikeHref();
        $(function () {
            var options = { active: establishment.index() + 1 };
            var resultsTabs = $("#results_tabs");
            resultsTabs.tabs('destroy');
            resultsTabs.tabs(options);
            $('a[href$="' + establishment.tab_href() + '"]:first').click();
        });
    };

    self.GetReviews = function (establishment) {
        for (var i in self.service) {
            var provider = self.service[i];
            if (provider.GetReviews != undefined) {
                provider.GetReviews(establishment, self.GetReviewsSuccess, self.GetReviewsFailure);
            }
        }
    };

    self.LoadReview = function(establishment, reviewPk) {
        for (var i in self.service) {
            var provider = self.service[i];
            if (provider.LoadReview != undefined) {
                provider.LoadReview(establishment, reviewPk, self.GetReviewsSuccess, self.GetReviewsFailure);
            }
        }
    };

    self.RequestDetailsSuccess = function (establishment) {
        if (!establishment.source()) {
            var features = self.GetFeatures(establishment);
            var openHours = self.GetOpenHours(establishment);
            var photosUrls = self.GetPhotos(establishment);

            for (var i in self.service) {
                var provider = self.service[i];
                if (provider.PostEstablishment != undefined) {
                    provider.PostEstablishment(establishment, features, openHours, photosUrls, undefined, undefined);
                }
            }
        }
    };

    self.RequestDetailsFailed = function (establishment) {
        clearTimeout(self.timeoutId);
        self.timeoutId = setTimeout(self.LookForEstablishmentDetails, 15000);
    };

    self.RequestEstablishmentDetails = function (establishment) {
        if (!establishment.detailsRequested()) {
            establishment.detailsRequested(true);
        }
        
        for (var i in self.service) {
            var provider = self.service[i];
            provider.RequestEstablishmentDetails(establishment, self.RequestDetailsSuccess, self.RequestDetailsFailed);
        }
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
            self.map.GeocodeAddress(searchString, self.LocationFound, self.LocationNotFound);
        } else {
            self.Search();
        }
    };

    self.SearchNearbyClick = function() {
        self.init_location();
    };

    self.EstablishmentsMap = {};

    self.searching = false;

    
    self.Search = function () {
        if (!self.searching) {
            self.searching = true;
            self.searchingTimout = setTimeout(function () { self.searching = false; }, 5000);
            self.CancelDelayedSearch();
            self.timeout = setInterval(self.CancelDelayedSearch, 3000);
            if (self.map != undefined) {
                self.map.clearOverlays();
                self.latitude(self.map.latitude());
                self.longitude(self.map.longitude());
                self.bounds(self.map.bounds());
                self.radius(self.map.radius());
            }
            
            self.EstablishmentsMap = {};
            self.Establishments.removeAll();

            for (var i in self.service) {
                var provider = self.service[i];
                provider.SearchNearby(['bar'], self.latitude(), self.longitude(), self.radius(), self.bounds(), self.searchText(), self.NearbySearchCallback, self.NearbySearchFailed);
            }
        }
    };

    self.DisplayEstablishmentDetails = function (establishmentPk, reviewPk) {
        for (var i in self.service) {
            var provider = self.service[i];
            if (provider.DisplayEstablishmentDetails != undefined) {
                provider.DisplayEstablishmentDetails(establishmentPk, reviewPk, self.DisplayEstablishmentDetailsSuccess, self.DisplayEstablishmentDetailsFailure);
            }
        }
        $(".featured").toggle();
        //var wwDrinkEstablishment = "/api/Establishment";
        //var establishmentDetailsUrl = wwDrinkEstablishment + "/" + establishmentPk;
        //$.get(establishmentDetailsUrl, function(data) {
        //    if (data) {
        //        var establishment = self.CreateEstablishment(data);
        //        self.MapEstablishment(establishment, data);
        //        self.GetReviews(establishment);
        //        if (reviewPk) {
        //            self.LoadReview(establishment, reviewPk);
        //        }
        //    }

        //    if (!establishment.detailsRequested()) {
        //        establishment.detailsRequested(true);
        //        self.RequestGoogleDetails(establishment);
        //    }
        //}).error(function() {
        //});
    };

    self.DisplayEstablishmentDetailsSuccess = function(establishment) {
        self.ShowDetails(establishment);
        for (var i in self.service) {
            var provider = self.service[i];
            if (provider.RequestEstablishmentDetails != undefined && provider.DisplayEstablishmentDetails == undefined) {
                provider.RequestEstablishmentDetails(establishment);
            }
        }
    };

    self.DisplayEstablishmentDetailsFailure = function() {

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

        var features = self.GetFeatures(establishment);
        var openHours = self.GetOpenHours(establishment);
        var photosUrls = self.GetPhotos(establishment);
        
        for (var i in self.service) {
            var provider = self.service[i];
            if (provider.PostReview != undefined) {
                provider.PostReview(establishment, features, openHours, photosUrls, undefined, undefined); 
            }
        }
    };
    
    self.ShowRandomCity = function () {
        var cities = [
            ["Kensington, Australia", "-37.7949955", "144.92515895", "1500"],
            ["Tokyo, Japan", "35.685", "139.751", "5000"],
            ["New York, New York", "40.75", "-73.98", "5000"],
            ["Distrito Federal, Mexico", "19.4424", "-99.131", "10000"],
            ["Maharashtra, India", "19.017", "72.857", "15000"],
            ["São Paulo, Brazil", "-23.5587", "-46.625", "10000"],
            ["Delhi, India", "28.67", "77.23", "15000"],
            ["Shanghai, China", "31.2165", "121.437", "5000"],
            ["West Bengal, India", "22.495", "88.3247", "15000"],
            ["Dhaka, Bangladesh", "23.7231", "90.4086", "5000"],
            ["Ciudad de Buenos Aires, Argentina", "-34.6025", "-58.3975", "5000"],
            ["Los Angeles, California", "33.99", "-118.18", "5000"],
            ["Sind, Pakistan", "24.87", "66.99", "5000"],
            ["Al Qahirah, Egypt", "30.05", "31.25", "15000"],
            ["Rio de Janeiro, Brazil", "-22.925", "-43.225", "5000"],
            ["Osaka, Japan", "34.75", "135.46", "10000"],
            ["Beijing, China", "39.9289", "116.388", "5000"],
            ["Metropolitan Manila, Philippines", "14.6042", "120.982", "5000"],
            ["Moskva, Russia", "55.7522", "37.6155", "10000"],
            ["Istanbul, Turkey", "41.105", "29.01", "5000"],
            ["Île-de-France, France", "48.8667", "2.33334", "5000"],
            ["Seoul, South Korea", "37.5663", "127", "5000"],
            ["Lagos, Nigeria", "6.44326", "3.39153", "5000"],
            ["Jakarta Raya, Indonesia", "-6.17442", "106.829", "5000"],
            ["Chicago, Illinois", "41.83", "-87.7501", "5000"],
            ["Guangdong, China", "23.145", "113.325", "10000"],
            ["Westminster, United Kingdom", "51.5", "-0.116722", "5000"],
            ["Lima, Peru", "-12.048", "-77.0501", "5000"],
            ["Tehran, Iran", "35.6719", "51.4243", "5000"],
            ["Kinshasa City, Congo (Kinshasa)", "-4.32972", "15.315", "15000"],
            ["Bogota, Colombia", "4.59642", "-74.0833", "10000"],
            ["Guangdong, China", "22.5524", "114.122", "5000"],
            ["Hubei, China", "30.58", "114.27", "5000"],
            [", Hong Kong S.A.R.", "22.305", "114.185", "5000"],
            ["Tianjin, China", "39.13", "117.2", "5000"],
            ["Tamil Nadu, India", "13.09", "80.28", "15000"],
            ["Karnataka, India", "12.97", "77.56", "15000"],
            ["Bangkok Metropolis, Thailand", "13.75", "100.517", "10000"],
            ["Punjab, Pakistan", "31.56", "74.35", "5000"],
            ["Chongqing, China", "29.565", "106.595", "5000"],
            ["Andhra Pradesh, India", "17.4", "78.48", "15000"],
            ["Región Metropolitana de Santiago, Chile", "-33.45", "-70.667", "5000"],
            ["Miami, Florida", "25.7876", "-80.2241", "5000"],
            ["Minas Gerais, Brazil", "-19.915", "-43.915", "5000"],
            ["Comunidad de Madrid, Spain", "40.4", "-3.68335", "5000"],
            ["Philadelphia, Pennsylvania", "40", "-75.17", "5000"],
            ["Dadra and Nagar Haveli, India", "23.0301", "72.58", "15000"],
            ["H? Chí Minh city, Vietnam", "10.78", "106.695", "10000"],
            ["Ontario, Canada", "43.7", "-79.42", "5000"],
            ["Baghdad, Iraq", "33.3386", "44.3939", "5000"],
            ["Cataluña, Spain", "41.3833", "2.18337", "5000"],
            ["Dallas, Texas", "32.82", "-96.84", "5000"],
            ["Liaoning, China", "41.805", "123.45", "5000"],
            ["Khartoum, Sudan", "15.5881", "32.5342", "15000"],
            ["Maharashtra, India", "18.53", "73.85", "15000"],
            ["City of St. Petersburg, Russia", "59.939", "30.316", "10000"],
            ["Chittagong, Bangladesh", "22.33", "91.8", "5000"],
            ["Atlanta, Georgia", "33.83", "-84.3999", "5000"],
            ["Boston, Massachusetts", "42.33", "-71.07", "5000"],
            ["Ar Riyad, Saudi Arabia", "24.6408", "46.7727", "10000"],
            ["Houston, Texas", "29.82", "-95.34", "5000"],
            [", Singapore", "1.29303", "103.856", "5000"],
            ["Thái Nguyên, Vietnam", "21.0333", "105.85", "10000"],
            ["Washington, D.C., District of Columbia", "38.8995", "-77.0094", "5000"],
            ["New South Wales, Australia", "-33.92", "151.185", "5000"],
            ["Jalisco, Mexico", "20.67", "-103.33", "5000"],
            ["Al Iskandariyah, Egypt", "31.2", "29.95", "15000"],
            ["Sichuan, China", "30.67", "104.07", "5000"],
            ["Detroit, Michigan", "42.33", "-83.0801", "5000"],
            ["Yangon, Myanmar", "16.7834", "96.1667", "10000"],
            ["Shaanxi, China", "34.275", "108.895", "5000"],
            ["Luanda, Angola", "-8.83829", "13.2344", "15000"],
            ["Rio Grande do Sul, Brazil", "-30.05", "-51.2", "10000"],
            ["Dadra and Nagar Haveli, India", "21.2", "72.84", "15000"],
            ["Lagunes, Ivory Coast", "5.32", "-4.04005", "15000"],
            ["Victoria, Australia", "-37.82", "144.975", "5000"],
            ["Ankara, Turkey", "39.9272", "32.8644", "5000"],
            ["Nuevo León, Mexico", "25.67", "-100.33", "5000"],
            ["Jiangsu, China", "32.05", "118.78", "10000"],
            ["Québec, Canada", "45.5", "-73.5833", "10000"],
            ["Guizhou, China", "26.58", "106.72", "5000"],
            ["Pernambuco, Brazil", "-8.07565", "-34.9156", "5000"],
            ["Heilongjiang, China", "45.75", "126.65", "10000"],
            ["Distrito Federal, Brazil", "-15.7833", "-47.9161", "10000"],
            ["Phoenix, Arizona", "33.54", "-112.07", "5000"],
            ["Bahia, Brazil", "-12.97", "-38.48", "5000"],
            ["Busan, South Korea", "35.0951", "129.01", "5000"],
            ["San Francisco, California", "37.74", "-122.46", "5000"],
            ["Gauteng, South Africa", "-26.17", "28.03", "15000"],
            ["Berlin, Germany", "52.5218", "13.4015", "5000"],
            ["Ceará, Brazil", "-3.75002", "-38.58", "5000"],
            ["Alger, Algeria", "36.7631", "3.05055", "15000"],
            ["Lazio, Italy", "41.896", "12.4833", "10000"],
            ["P'yongyang, North Korea", "39.0194", "125.755", "5000"],
            ["Antioquia, Colombia", "6.275", "-75.575", "10000"],
            ["Kabul, Afghanistan", "34.5167", "69.1833", "5000"],
            ["Attiki, Greece", "37.9833", "23.7333", "10000"],
            ["Aichi, Japan", "35.155", "136.915", "5000"],
            ["Western Cape, South Africa", "-33.92", "18.435", "15000"],
            ["Jilin, China", "43.865", "125.34", "5000"],
            ["Grand Casablanca, Morocco", "33.6", "-7.61637", "15000"],
            ["Liaoning, China", "38.9228", "121.63", "5000"],
            ["Uttar Pradesh, India", "26.46", "80.32", "15000"],
            ["Kano, Nigeria", "12", "8.52004", "15000"],
            ["Tel Aviv, Israel", "32.08", "34.77", "10000"],
            ["Addis Ababa, Ethiopia", "9.03331", "38.7", "15000"],
            ["Paraná, Brazil", "-25.42", "-49.32", "5000"],
            ["Seattle, Washington", "47.57", "-122.34", "5000"],
            ["Shandong, China", "36.8", "118.05", "5000"],
            ["Makkah, Saudi Arabia", "21.5169", "39.2192", "10000"],
            ["Nairobi, Kenya", "-1.28335", "36.8167", "15000"],
            ["Zhejiang, China", "30.25", "120.17", "5000"],
            ["Gauteng, South Africa", "-26.1496", "28.3299", "15000"],
            ["Distrito Capital, Venezuela", "10.501", "-66.917", "5000"],
            ["Lombardia, Italy", "45.47", "9.20501", "10000"],
            ["Yunnan, China", "25.07", "102.68", "5000"],
            ["Dar-Es-Salaam, Tanzania", "-6.80001", "39.2683", "15000"],
            ["Rajasthan, India", "26.9211", "75.81", "15000"],
            ["San Diego, California", "32.82", "-117.18", "5000"],
            ["Shanxi, China", "37.875", "112.545", "10000"],
            ["Shandong, China", "36.09", "120.33", "5000"],
            ["Jawa Timur, Indonesia", "-7.24924", "112.751", "10000"],
            ["Lisboa, Portugal", "38.7227", "-9.14487", "10000"],
            ["Shandong, China", "36.675", "116.995", "10000"],
            ["Fukuoka, Japan", "33.595", "130.41", "10000"],
            ["São Paulo, Brazil", "-22.9", "-47.1", "5000"],
            ["Aleppo (Halab), Syria", "36.23", "37.17", "10000"],
            ["KwaZulu-Natal, South Africa", "-29.865", "30.98", "15000"],
            ["Kiev, Ukraine", "50.4334", "30.5166", "10000"],
            ["Uttar Pradesh, India", "26.855", "80.915", "15000"],
            [", Puerto Rico", "18.44", "-66.13", "5000"],
            ["Henan, China", "34.755", "113.665", "5000"],
            ["Oyo, Nigeria", "7.38003", "3.92998", "15000"],
            ["Punjab, Pakistan", "31.41", "73.11", "5000"],
            ["Minneapolis, Minnesota", "44.98", "-93.2518", "5000"],
            ["Fujian, China", "26.08", "119.3", "10000"],
            ["Hunan, China", "28.2", "112.97", "10000"],
            ["Dakar, Senegal", "14.7158", "-17.4731", "15000"],
            ["Taipei City, Taiwan", "25.0167", "121.45", "5000"],
            ["Izmir, Turkey", "38.4361", "27.1518", "5000"],
            ["Gansu, China", "36.056", "103.792", "5000"],
            ["Inch'on-gwangyoksi, South Korea", "37.4761", "126.642", "10000"],
            ["Hokkaido, Japan", "43.075", "141.34", "5000"],
            ["Fujian, China", "24.45", "118.08", "5000"],
            ["Guayas, Ecuador", "-2.22003", "-79.92", "5000"],
            ["Razavi Khorasan, Iran", "36.27", "59.57", "5000"],
            ["Damascus, Syria", "33.5", "36.3", "10000"],
            ["Taegu-gwangyoksi, South Korea", "35.8668", "128.607", "5000"],
            ["Maharashtra, India", "21.17", "79.09", "15000"],
            ["Liaoning, China", "40.7503", "120.83", "5000"],
            ["Hebei, China", "38.05", "114.48", "5000"],
            ["Jilin, China", "43.85", "126.55", "5000"],
            ["Jawa Barat, Indonesia", "-6.95003", "107.57", "5000"],
            ["Zhejiang, China", "28.02", "120.65", "5000"],
            ["Jiangxi, China", "28.68", "115.88", "5000"],
            ["Wien, Austria", "48.2", "16.3666", "10000"],
            ["Tampa, Florida", "27.947", "-82.4586", "5000"],
            ["Denver, Colorado", "39.7392", "-104.984", "5000"],
            ["West Midlands, United Kingdom", "52.475", "-1.92", "5000"],
            ["Baltimore, Maryland", "39.3", "-76.62", "5000"],
            ["Valle del Cauca, Colombia", "3.39996", "-76.5", "5000"],
            ["Campania, Italy", "40.84", "14.245", "10000"],
            ["Miyagi, Japan", "38.2871", "141.022", "5000"],
            ["Manchester, United Kingdom", "53.5004", "-2.24799", "5000"],
            ["St. Louis, Missouri", "38.635", "-90.24", "5000"],
            ["Puebla, Mexico", "19.05", "-98.2", "5000"],
            ["Tajura' wa an Nawahi al Arba, Libya", "32.8925", "13.18", "10000"],
            ["Tashkent, Uzbekistan", "41.3117", "69.2949", "5000"],
            ["Sichuan, China", "30.7804", "106.13", "5000"],
            ["Ciudad de la Habana, Cuba", "23.132", "-82.3642", "10000"],
            ["Guangxi, China", "22.82", "108.32", "5000"],
            ["Pará, Brazil", "-1.45", "-48.48", "10000"],
            ["Bihar, India", "25.625", "85.13", "15000"],
            ["Distrito Nacional, Dominican Republic", "18.4701", "-69.9001", "5000"],
            ["Xinjiang Uygur, China", "43.805", "87.575", "10000"],
            ["British Columbia, Canada", "49.2734", "-123.122", "5000"],
            ["Shandong, China", "34.88", "117.57", "5000"],
            ["Greater Accra, Ghana", "5.55003", "-0.216716", "15000"],
            ["Shandong, China", "37.5304", "121.4", "5000"],
            ["Sumatera Utara, Indonesia", "3.57997", "98.65", "5000"],
            ["Jiangsu, China", "34.28", "117.18", "5000"],
            ["Shandong, China", "35.08", "118.33", "5000"],
            ["Zulia, Venezuela", "10.73", "-71.66", "5000"],
            ["Al Kuwayt, Kuwait", "29.3697", "47.9783", "10000"],
            ["Hiroshima, Japan", "34.3878", "132.443", "5000"],
            ["Nei Mongol, China", "40.6522", "109.822", "5000"],
            ["Anhui, China", "31.85", "117.28", "5000"],
            ["Madhya Pradesh, India", "22.7151", "75.865", "15000"],
            ["Goiás, Brazil", "-16.72", "-49.3", "10000"],
            ["Amanat Al Asimah, Yemen", "15.3547", "44.2066", "10000"],
            ["Ouest, Haiti", "18.541", "-72.336", "5000"],
            ["Qu?ng Ninh, Vietnam", "20.83", "106.68", "10000"],
            ["Henan, China", "33.0004", "112.53", "5000"],
            ["Bucharest, Romania", "44.4334", "26.0999", "10000"],
            ["Zhejiang, China", "29.88", "121.55", "5000"],
            ["Littoral, Cameroon", "4.06041", "9.70999", "15000"],
            ["Baki, Azerbaijan", "40.3953", "49.8622", "5000"],
            ["Cleveland, Ohio", "41.47", "-81.695", "5000"],
            ["Hebei, China", "39.6243", "118.194", "10000"],
            ["Portland, Oregon", "45.52", "-122.68", "5000"],
            ["Shanxi, China", "40.08", "113.3", "5000"],
            ["Asunción, Paraguay", "-25.2964", "-57.6415", "10000"],
            ["Queensland, Australia", "-27.455", "153.035", "5000"],
            ["Punjab, Pakistan", "33.6", "73.04", "5000"],
            ["Beirut, Lebanon", "33.872", "35.5097", "10000"],
            ["Pittsburgh, Pennsylvania", "40.43", "-80", "5000"],
            ["Las Vegas, Nevada", "36.21", "-115.22", "5000"],
            ["Kyoto, Japan", "35.03", "135.75", "5000"],
            ["Minsk, Belarus", "53.9", "27.5666", "5000"],
            ["Atlántico, Colombia", "10.96", "-74.8", "5000"],
            ["Carabobo, Venezuela", "10.23", "-67.98", "5000"],
            ["Hamburg, Germany", "53.55", "10", "5000"],
            ["Dadra and Nagar Haveli, India", "22.31", "73.18", "15000"],
            ["Henan, China", "34.4504", "115.65", "5000"],
            ["Amazonas, Brazil", "-3.10003", "-60", "5000"],
            ["Sumatera Selatan, Indonesia", "-2.98004", "104.75", "5000"],
            ["Jiangsu, China", "31.58", "120.3", "5000"],
            ["San Bernardino, California", "34.1204", "-117.3", "5000"],
            ["Brussels, Belgium", "50.8333", "4.33332", "10000"],
            ["Madhya Pradesh, India", "23.25", "77.41", "15000"],
            ["Nei Mongol, China", "40.82", "111.66", "10000"],
            ["Henan, China", "34.68", "112.47", "5000"],
            ["São Paulo, Brazil", "-23.9537", "-46.3329", "5000"],
            ["Hubei, China", "30.6501", "113.16", "5000"],
            ["Masovian, Poland", "52.25", "21", "10000"],
            ["Rabat - Salé - Zemmour - Zaer, Morocco", "34.0253", "-6.83613", "15000"],
            ["Espírito Santo, Brazil", "-20.324", "-40.366", "10000"],
            ["Pichincha, Ecuador", "-0.214988", "-78.5001", "5000"],
            ["Antananarivo, Madagascar", "-18.9166", "47.5166", "5000"],
            ["Tamil Nadu, India", "11", "76.95", "15000"],
            ["Heilongjiang, China", "46.58", "125", "5000"],
            ["Anhui, China", "31.7503", "116.48", "5000"],
            ["Budapest, Hungary", "47.5", "19.0833", "5000"],
            ["San Jose, California", "37.3", "-121.85", "5000"],
            ["Piemonte, Italy", "45.0704", "7.66996", "10000"],
            ["Jiangsu, China", "31.3005", "120.62", "5000"],
            ["Punjab, India", "30.9278", "75.8723", "15000"],
            ["Ashanti, Ghana", "6.68999", "-1.63001", "15000"],
            ["Heilongjiang, China", "47.345", "123.99", "10000"],
            ["Liaoning, China", "41.115", "122.94", "10000"],
            ["Cincinnati, Ohio", "39.1619", "-84.4569", "5000"],
            ["Hebei, China", "36.58", "114.48", "5000"],
            ["Shandong, China", "36.2", "117.12", "5000"],
            ["Esfahan, Iran", "32.7", "51.7", "5000"],
            ["Centre, Cameroon", "3.8667", "11.5167", "15000"],
            ["Sacramento, California", "38.575", "-121.47", "5000"],
            ["Guangdong, China", "23.37", "116.67", "5000"],
            ["Uttar Pradesh, India", "27.1704", "78.015", "15000"],
            ["Guangdong, China", "21.2", "110.38", "5000"],
            ["La Paz, Bolivia", "-16.498", "-68.15", "5000"],
            ["Federal Capital Territory, Nigeria", "9.08333", "7.53333", "15000"],
            ["Harare, Zimbabwe", "-17.8178", "31.0447", "15000"],
            ["Hubei, China", "30.3704", "113.44", "5000"],
            ["Shandong, China", "36.7204", "119.1", "5000"],
            ["Baja California, Mexico", "32.5", "-117.08", "5000"],
            ["Khulna, Bangladesh", "22.84", "89.56", "5000"],
            ["Henan, China", "32.1304", "114.07", "5000"],
            ["Kaohsiung City, Taiwan", "22.6333", "120.267", "10000"],
            ["Sichuan, China", "28.88", "105.38", "5000"],
            ["Western Australia, Australia", "-31.955", "115.84", "5000"],
            ["México, Mexico", "19.3304", "-99.67", "10000"],
            ["West Yorkshire, United Kingdom", "53.83", "-1.58002", "5000"],
            ["Andhra Pradesh, India", "17.73", "83.305", "15000"],
            ["Punjab, Pakistan", "30.2", "71.455", "5000"],
            ["Kerala, India", "10.015", "76.2239", "15000"],
            ["Punjab, Pakistan", "32.1604", "74.185", "5000"],
            ["Montevideo, Uruguay", "-34.858", "-56.1711", "5000"],
            ["Guangxi, China", "24.28", "109.25", "5000"],
            ["Bamako, Mali", "12.65", "-8.00004", "15000"],
            ["Conakry, Guinea", "9.53152", "-13.6802", "15000"],
            ["Bursa, Turkey", "40.2", "29.07", "5000"],
            ["Virginia Beach, Virginia", "36.8532", "-75.9783", "5000"],
            ["Guanajuato, Mexico", "21.15", "-101.7", "5000"],
            ["Maharashtra, India", "20.0004", "73.78", "15000"],
            ["San Antonio, Texas", "29.4873", "-98.5073", "5000"],
            ["Liaoning, China", "41.8654", "123.87", "10000"],
            ["Hunan, China", "29.03", "111.68", "5000"],
            ["Kansas City, Missouri", "39.1071", "-94.6041", "5000"],
            ["Daejeon, South Korea", "36.3355", "127.425", "5000"],
            ["Phnom Penh, Cambodia", "11.55", "104.917", "10000"],
            ["Sichuan, China", "29.5804", "105.05", "5000"],
            ["Fujian, China", "24.9", "118.58", "5000"],
            ["Kharkiv, Ukraine", "50", "36.25", "5000"],
            ["Sind, Pakistan", "25.38", "68.375", "5000"],
            ["Maritime, Togo", "6.13194", "1.22276", "15000"],
            ["Córdoba, Argentina", "-31.4", "-64.1823", "10000"],
            ["Anhui, China", "32.63", "116.98", "5000"],
            ["Selangor, Malaysia", "3.16667", "101.7", "5000"],
            ["Maputo, Mozambique", "-25.9553", "32.5892", "15000"],
            ["Kaduna, Nigeria", "10.52", "7.44", "15000"],
            ["Kwangju-gwangyoksi, South Korea", "35.171", "126.91", "5000"],
            ["Indianapolis, Indiana", "39.75", "-86.17", "5000"],
            ["San Salvador, El Salvador", "13.71", "-89.203", "5000"],
            ["Rhône-Alpes, France", "45.77", "4.83003", "5000"],
            ["Tehran, Iran", "35.8004", "50.97", "5000"],
            ["Santa Cruz, Bolivia", "-17.7539", "-63.226", "10000"],
            ["Kampala, Uganda", "0.316659", "32.5833", "15000"],
            ["East Azarbaijan, Iran", "38.0863", "46.3012", "5000"],
            ["Davao Del Sur, Philippines", "7.11002", "125.63", "5000"],
            ["Provence-Alpes-Côte-d'Azur, France", "43.29", "5.37501", "10000"],
            ["Uttar Pradesh, India", "29.0004", "77.7", "15000"],
            ["Jawa Tengah, Indonesia", "-6.96662", "110.42", "5000"],
            ["Sichuan, China", "31.47", "104.77", "5000"],
            ["Novosibirsk, Russia", "55.03", "82.96", "5000"],
            ["Milwaukee, Wisconsin", "43.0527", "-87.92", "5000"],
            ["Makkah, Saudi Arabia", "21.43", "39.82", "10000"],
            ["Dubay, United Arab Emirates", "25.23", "55.28", "10000"],
            ["Pool, Congo (Brazzaville)", "-4.25919", "15.2847", "15000"],
            ["Katanga, Congo (Kinshasa)", "-11.68", "27.48", "15000"],
            ["Uttar Pradesh, India", "25.33", "83", "15000"],
            ["Hunan, China", "28.6004", "112.33", "5000"],
            ["Orlando, Florida", "28.51", "-81.38", "5000"],
            ["Chihuahua, Mexico", "31.6904", "-106.49", "5000"],
            ["Uttar Pradesh, India", "28.6604", "77.4084", "15000"],
            ["Shandong, China", "35.23", "115.45", "5000"],
            ["Gauteng, South Africa", "-25.7069", "28.2294", "15000"],
            ["Porto, Portugal", "41.15", "-8.62", "5000"],
            ["Lusaka, Zambia", "-15.4166", "28.2833", "15000"],
            ["Jiangsu, China", "31.78", "119.97", "5000"],
            ["Ninawa, Iraq", "36.345", "43.145", "10000"],
            ["Sverdlovsk, Russia", "56.85", "60.6", "5000"],
            ["N.W.F.P., Pakistan", "34.005", "71.535", "5000"],
            ["Jharkhand, India", "22.7875", "86.1975", "15000"],
            ["Kasaï-Oriental, Congo (Kinshasa)", "-6.15003", "23.6", "15000"],
            ["Tamil Nadu, India", "9.92003", "78.12", "15000"],
            ["Adana, Turkey", "36.995", "35.32", "5000"],
            ["Madhya Pradesh, India", "23.1751", "79.9551", "15000"],
            ["San José, Costa Rica", "9.93501", "-84.0841", "10000"],
            ["Panama, Panama", "8.96802", "-79.533", "10000"],
            ["Nizhegorod, Russia", "56.333", "44.0001", "10000"],
            ["Providence, Rhode Island", "41.8211", "-71.415", "5000"],
            ["Nei Mongol, China", "42.27", "118.95", "5000"],
            ["Bayern, Germany", "48.1299", "11.575", "10000"],
            ["Columbus, Ohio", "39.98", "-82.99", "5000"],
            ["Stockholm, Sweden", "59.3508", "18.0973", "5000"],
            ["Jiangsu, China", "33.58", "119.03", "5000"],
            ["Sulawesi Selatan, Indonesia", "-5.13996", "119.432", "5000"],
            ["Dadra and Nagar Haveli, India", "22.31", "70.8", "15000"],
            ["Jharkhand, India", "23.8004", "86.42", "15000"],
            ["Auckland, New Zealand", "-36.85", "174.765", "5000"],
            ["Heilongjiang, China", "44.575", "129.59", "5000"],
            ["Fars, Iran", "29.63", "52.57", "5000"],
            ["Zhejiang, China", "30.8704", "120.1", "5000"],
            ["Gansu, China", "34.6", "105.92", "5000"],
            ["Punjab, India", "31.64", "74.87", "15000"],
            ["Almaty, Kazakhstan", "43.325", "76.915", "5000"],
            ["Santa Fe, Argentina", "-32.9511", "-60.6663", "5000"],
            ["Uttar Pradesh, India", "25.455", "81.84", "15000"],
            ["Edo, Nigeria", "6.34048", "5.62001", "15000"],
            ["Shandong, China", "35.4004", "116.55", "5000"],
            ["Alagoas, Brazil", "-9.62", "-35.73", "10000"],
            ["Grad Sofiya, Bulgaria", "42.6833", "23.3167", "5000"],
            ["Benghazi, Libya", "32.1167", "20.0667", "15000"],
            ["Prague, Czech Republic", "50.0833", "14.466", "10000"],
            ["Austin, Texas", "30.2669", "-97.7428", "5000"],
            ["Glasgow, United Kingdom", "55.8744", "-4.25071", "5000"],
            ["Sichuan, China", "29.5671", "103.733", "5000"],
            ["Kadiogo, Burkina Faso", "12.3703", "-1.52472", "15000"],
            ["South Australia, Australia", "-34.935", "138.6", "5000"],
            ["Ontario, Canada", "45.4167", "-75.7", "10000"],
            ["Coahuila, Mexico", "25.5701", "-103.42", "5000"],
            ["Jammu and Kashmir, India", "34.1", "74.815", "15000"],
            ["Andhra Pradesh, India", "16.52", "80.63", "15000"],
            ["Samara, Russia", "53.195", "50.1513", "5000"],
            ["Omsk, Russia", "54.99", "73.4", "5000"],
            ["Namp'o-si, North Korea", "38.7669", "125.452", "5000"],
            ["Guangxi, China", "22.63", "110.15", "5000"],
            ["Lara, Venezuela", "10.05", "-69.3", "5000"],
            ["Tatarstan, Russia", "55.7499", "49.1263", "10000"],
            ["Southern Finland, Finland", "60.1756", "24.9341", "5000"],
            ["Maharashtra, India", "19.8957", "75.3203", "15000"],
            ["Alberta, Canada", "51.083", "-114.08", "5000"],
            ["Zürich, Switzerland", "47.38", "8.55001", "10000"],
            ["Hebei, China", "38.8704", "115.48", "5000"],
            ["Sichuan, China", "29.4", "104.78", "5000"],
            ["Erevan, Armenia", "40.1812", "44.5136", "5000"],
            ["Tbilisi, Georgia", "41.725", "44.7908", "10000"],
            ["Banaadir, Somalia", "2.06668", "45.3667", "15000"],
            ["Grad Beograd, Serbia", "44.8186", "20.468", "10000"],
            ["Chelyabinsk, Russia", "55.155", "61.4387", "5000"],
            ["Rio Grande do Norte, Brazil", "-5.78002", "-35.24", "5000"],
            ["Hovedstaden, Denmark", "55.6786", "12.5635", "10000"],
            ["Memphis, Tennessee", "35.12", "-90", "5000"],
            ["Hunan, China", "27.83", "113.15", "5000"],
            ["Taichung City, Taiwan", "24.1521", "120.682", "10000"],
            ["Gyeonggi-do, South Korea", "37.2578", "127.011", "5000"],
            ["Gauteng, South Africa", "-26.6496", "27.96", "15000"],
            ["Hubei, China", "32.02", "112.13", "5000"],
            ["Ulsan, South Korea", "35.5467", "129.317", "5000"],
            ["Amman, Jordan", "31.95", "35.9333", "5000"],
            ["Dublin, Ireland", "53.3331", "-6.24891", "5000"],
            ["Alberta, Canada", "53.55", "-113.5", "5000"],
            ["Maharashtra, India", "17.6704", "75.9", "15000"],
            ["Rostov, Russia", "47.2346", "39.7127", "10000"],
            ["Dnipropetrovs'k, Ukraine", "48.48", "35", "5000"],
            ["Gansu, China", "36.62", "101.77", "5000"],
            ["Hebei, China", "40.83", "114.93", "5000"],
            ["Nord-Pas-de-Calais, France", "50.65", "3.08001", "5000"],
            ["Gaziantep, Turkey", "37.075", "37.385", "5000"],
            ["Jharkhand, India", "23.37", "85.33", "15000"],
            ["Montserrado, Liberia", "6.31056", "-10.8048", "15000"],
            ["Maranhão, Brazil", "-2.51598", "-44.266", "10000"],
            ["Noord-Holland, Netherlands", "52.35", "4.91664", "5000"],
            ["Guatemala, Guatemala", "14.6211", "-90.527", "10000"],
            ["Santa Catarina, Brazil", "-27.58", "-48.52", "10000"],
            ["Eastern Cape, South Africa", "-33.97", "25.6", "15000"],
            ["Rivers, Nigeria", "4.81", "7.01", "15000"],
            ["Heilongjiang, China", "46.83", "130.35", "5000"],
            ["Bashkortostan, Russia", "54.79", "56.04", "5000"],
            ["Bridgeport, Connecticut", "41.18", "-73.2", "5000"],
            ["Buffalo, New York", "42.88", "-78.88", "5000"],
            ["Hunan, China", "26.88", "112.59", "5000"],
            ["Liaoning, China", "41.3304", "123.75", "5000"],
            ["Haifa, Israel", "32.8204", "34.98", "10000"],
            ["Al Madinah, Saudi Arabia", "24.5", "39.58", "10000"],
            ["Santander, Colombia", "7.13009", "-73.1259", "5000"],
            ["Zuid-Holland, Netherlands", "51.92", "4.47997", "5000"],
            ["Homs (Hims), Syria", "34.73", "36.72", "10000"],
            ["Nordrhein-Westfalen, Germany", "50.93", "6.95", "10000"],
            ["Hebei, China", "39.9304", "119.62", "5000"],
            ["Fès - Boulemane, Morocco", "34.0546", "-5.00038", "15000"],
            ["Hunan, China", "26.2304", "111.62", "5000"],
            ["Perm', Russia", "58", "56.25", "10000"],
            ["Khuzestan, Iran", "31.28", "48.72", "5000"],
            ["Rajasthan, India", "26.2918", "73.0168", "15000"],
            ["Charlotte, North Carolina", "35.205", "-80.83", "5000"],
            ["San Luis Potosí, Mexico", "22.17", "-101", "10000"],
            ["Ningxia Hui, China", "38.468", "106.273", "5000"],
            ["Odessa, Ukraine", "46.49", "30.71", "5000"],
            ["Hadjer-Lamis, Chad", "12.1131", "15.0491", "15000"],
            ["Donets'k, Ukraine", "48", "37.83", "5000"],
            ["Santa Catarina, Brazil", "-26.32", "-48.8399", "5000"],
            ["Jacksonville, Florida", "30.33", "-81.67", "5000"],
            ["Zhejiang, China", "30.7704", "120.75", "5000"],
            ["Guangxi, China", "25.28", "110.28", "5000"],
            ["Volgograd, Russia", "48.71", "44.5", "5000"],
            ["Assam, India", "26.16", "91.77", "15000"],
            ["Chandigarh, India", "30.72", "76.78", "15000"],
            ["Madhya Pradesh, India", "26.23", "78.1801", "15000"],
            ["Qom, Iran", "34.65", "50.95", "5000"],
            ["Salt Lake City, Utah", "40.775", "-111.93", "5000"],
            ["Yucatán, Mexico", "20.9666", "-89.6166", "10000"],
            ["Heilongjiang, China", "45.3", "130.97", "5000"],
            ["Jiangxi, China", "27.62", "113.85", "5000"],
            ["Mandalay, Myanmar", "21.97", "96.085", "5000"],
            ["Querétaro, Mexico", "20.63", "-100.38", "10000"],
            ["Selangor, Malaysia", "3.02037", "101.55", "5000"],
            ["Liaoning, China", "41.1204", "121.1", "5000"],
            ["Paraíba, Brazil", "-7.10114", "-34.8761", "10000"],
            ["Kerala, India", "8.49998", "76.95", "15000"],
            ["Kerala, India", "11.2504", "75.77", "15000"],
            ["Tamil Nadu, India", "10.81", "78.69", "15000"],
            ["Oyo, Nigeria", "8.13001", "4.23999", "5000"],
            ["Louisville, Kentucky", "38.225", "-85.7487", "5000"],
            ["Jiangsu, China", "32.0304", "120.825", "5000"],
            ["Francisco Morazán, Honduras", "14.102", "-87.2175", "5000"],
            ["Guangdong, China", "23.0301", "113.12", "5000"],
            ["Mandalay, Myanmar", "19.7666", "96.1186", "5000"],
            ["Provence-Alpes-Côte-d'Azur, France", "43.715", "7.26502", "5000"],
            ["Arbil, Iraq", "36.179", "44.0086", "10000"],
            ["Krasnoyarsk, Russia", "56.014", "92.866", "5000"],
            ["Antwerp, Belgium", "51.2204", "4.41502", "5000"],
            ["Managua, Nicaragua", "12.153", "-86.2685", "5000"],
            ["Konya, Turkey", "37.875", "32.475", "5000"],
            ["Jawa Barat, Indonesia", "-6.57", "106.75", "5000"],
            ["Niamey, Niger", "13.5167", "2.11666", "15000"],
            ["Jiangxi, China", "27.8", "114.93", "5000"],
            ["Anhui, China", "33.9504", "116.75", "5000"],
            ["Hartford, Connecticut", "41.77", "-72.68", "5000"],
            ["Richmond, Virginia", "37.55", "-77.45", "5000"],
            ["Piauí, Brazil", "-5.095", "-42.78", "5000"],
            ["Henan, China", "35.3204", "113.87", "5000"],
            ["Sichuan, China", "28.77", "104.57", "5000"],
            ["Borno, Nigeria", "11.85", "13.16", "15000"],
            ["Bhaktapur, Nepal", "27.7167", "85.3166", "5000"],
            ["Anhui, China", "32.95", "117.33", "5000"],
            ["Mendoza, Argentina", "-32.8833", "-68.8166", "5000"],
            ["Karnataka, India", "15.36", "75.125", "15000"],
            ["Kaduna, Nigeria", "11.08", "7.71001", "15000"],
            ["Bolívar, Colombia", "10.3997", "-75.5144", "5000"],
            ["Karnataka, India", "12.31", "76.66", "15000"],
            ["Henan, China", "36.08", "114.35", "5000"],
            ["Baja California, Mexico", "32.65", "-115.48", "5000"],
            ["Ulaanbaatar, Mongolia", "47.9167", "106.917", "5000"],
            ["Nei Mongol, China", "43.62", "122.27", "5000"],
            ["Coast, Kenya", "-4.04003", "39.6899", "15000"],
            ["Tyne and Wear, United Kingdom", "55.0004", "-1.59999", "5000"],
            ["Nashville, Tennessee", "36.17", "-86.78", "5000"],
            ["Johor, Malaysia", "1.48002", "103.73", "10000"],
            ["Hubei, China", "30.7", "111.28", "5000"],
            ["Chhattisgarh, India", "21.235", "81.635", "15000"],
            ["Tamil Nadu, India", "11.67", "78.1801", "15000"],
            ["Huambo, Angola", "-12.75", "15.76", "15000"],
            ["Henan, China", "34.85", "114.35", "5000"],
            ["Marrakech - Tensift - Al Haouz, Morocco", "31.63", "-7.99999", "15000"],
            ["Liaoning, China", "40.1436", "124.394", "5000"],
            ["Al-Basrah, Iraq", "30.5135", "47.8136", "10000"],
            ["Aguascalientes, Mexico", "21.8795", "-102.29", "5000"],
            ["Lampung, Indonesia", "-5.43002", "105.27", "5000"],
            ["Sicily, Italy", "38.125", "13.35", "5000"],
            ["Kigali City, Rwanda", "-1.95359", "30.0605", "15000"],
            ["Melbourne, Australia (AU)", "-37.81407309669506", "144.96439579895014", "1500"],
            ["Belfast, Northern Ireland", "54.59258586598787", "-5.932437428588863", "1100"],
            ["Derry, Northern Ireland", "54.999243520707154", "-7.322133534208317", "300"],
            ["Oxford, England", "51.752100602253314", "-1.2567392470825833", "1200"],
            ["Amsterdam, Neatherlands", "52.37558253868254", "4.8953170978763705", "600"],
            ["Copenhagen, Denmark", "55.676205694010136", "12.568444388360591", "550"],
            ["Clarke Quay, Singapore", "1.2892135032791805", "103.84820018900233", "250"]
        ];

        var random = Math.floor(Math.random() * cities.length);

        self.searchText(cities[random][0]);
        self.latitude(cities[random][1]);
        self.longitude(cities[random][2]);
        self.radius(cities[random][3]);
    };

    self.ShowRandomCity();
    self.initializeGoogleAndSearch(self);

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



