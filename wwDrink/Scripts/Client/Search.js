$(function () {
    $("#results_tabs").tabs();
});

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

    self.searchText = ko.observable();

    self.Establishments = ko.observableArray();
    self.Establishments.subscribe(function() {
    });

    self.country_name = ko.observable();
    self.country_code = ko.observable();
    self.city = ko.observable();
    self.ip_address = ko.observable();
    self.latitude = ko.observable();
    self.longitude = ko.observable();

    self.latitude("-37.794322");
    self.longitude("144.928571");

    self.init_google = function() {
        var currentLocation = new google.maps.LatLng(self.latitude(), self.longitude());
        
        self.map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: currentLocation,
            zoom: 15
        });
        self.geocoder = new google.maps.Geocoder();
    };


    self.service = ko.observable();
    self.infowindow = ko.observable();

    self.IsMacUser = ko.observable(navigator.platform == "Win32");
    self.IsWindowsUser = ko.observable(navigator.platform != "Win32");

    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    self.init_location = function () {
        
        xmlhttp.open("GET", "http://api.hostip.info/get_html.php?position=true", false);
        xmlhttp.send();

        hostipInfo = xmlhttp.responseText.split("\n");

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
            }
            catch (e) { }
        }
        
        //$.getJSON("http://api.hostip.info/get_json.php&position=true", function (data) {
        //    self.country_code(data.country_code);
        //    self.country_name(data.country_name);
        //    self.city(data.city);
        //    self.ip_address(data.ip);
        //    self.latitude(data.latitude);
        //    self.longitude(data.longitude);
        //});

    };

    self.searchText("Melbourne, Australia");

    self.AddEstablishment = function(place) {
        var establishment = new Establishment();
        establishment.PK(Guid.create());
        establishment.name(place.name);
        establishment.google_id(place.id);
        establishment.google_reference(place.reference);
        if (place.photos && place.photos.length > 0)
        {
            var url = place.photos[0].getUrl({ 'maxWidth': 240, 'maxHeight': 180 });
            establishment.imageUrl(url);
        } else {
            establishment.imageUrl("/Images/missing_establishment_image.png");
        }

        try {
            establishment.latitude(place.geometry.location.lb);
            establishment.longitude(place.geometry.location.mb);
        } catch (e) {
            
        } 
        try {
            var suburb = place.vicinity.split(', ');
            if (suburb.length == 2) {
                establishment.suburb(suburb[1]);
            }
            else if (suburb.length == 1) {
                establishment.suburb(suburb[0]);
            }
            if (place.opening_hours) {
                establishment.open(place.opening_hours.open_now);
            } else {
                establishment.open(false);
            }
        } catch (e) {

        }
        self.Establishments.push(establishment);
        self.CreateMarker(place);
    };

    self.Interests = ko.observableArray();

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

    self.CloseTab = function() {
        var establishment = this;
        self.Interests.remove(establishment);
    };

    self.SelectEstablishment = function() {
        var establishment = this;
        establishment.index(self.Interests().length + 2);
        establishment.tab_href("#results_tabs-" + establishment.index().toString());
        establishment.tab_name("results_tabs-" + (self.Interests().length + 2).toString());

        var request = {
            reference: establishment.google_reference()
        };
        if (establishment.open_hours().length == 0 && establishment.features().length == 0) {
            self.service().getDetails(request, function(place, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    establishment.address(place.formatted_address);
                    var i;
                    for (i = 0; i < place.types.length; i++) {
                        establishment.features.push({ name: place.types[i] });
                    }
                    for (i = 0; i < place.reviews.length; i++) {
                        establishment.reviews.push({ review: place.reviews[i].text });
                    }

                    establishment.open_hours(self.ParseOpenHours(place.opening_hours));
                }
            });
        }

        self.Interests.push(establishment);
        
        $(function () {
            var options = {};
            $("#results_tabs").tabs('destroy');
            $("#results_tabs").tabs(options);
        });
    };

    self.Listeners = new ko.observableArray();

    self.StepForward = function () {
        if (self.carousel) {
            self.carousel.stepBy('establishments', 1);
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

    self.StepLast = function() {
        if (self.carousel) {
            self.carousel.stepTo('establishments', this.Establishments.Length);
        }
    };

    self.CreateMarker = function(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: self.map,
            position: place.geometry.location
        });

        self.Listeners.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
            self.infowindow().setContent(place.name);
            self.infowindow().open(self.map, this);
        });
        
    };

    self.clearOverlays = function() {
        for (var i = 0; i < self.Listeners().length; i++) {
            self.Listeners()[i].setMap(null);
        }
        self.Listeners.removeAll();
    };

    self.Search = function () {
        var searchString = self.searchText();
        self.geocoder.geocode({ 'address': searchString }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.map.setCenter(results[0].geometry.location);
                self.latitude(results[0].geometry.location.lb);
                self.longitude(results[0].geometry.location.mb);
                var wwDrinkSearch = "/api/Search?Query=" + self.searchText() + "&" + "Latitude=" + self.latitude() + "&" + "Longitude=" + self.longitude();
                $.getJSON(wwDrinkSearch, function(data) {
                    try {
                        currentLocation = new google.maps.LatLng(self.latitude(), self.longitude());
                        var request = {
                            location: currentLocation,
                            radius: '1500',
                            types: ['bar']
                        };
                        self.infowindow(new google.maps.InfoWindow());
                        self.service(new google.maps.places.PlacesService(self.map));
                        self.service().nearbySearch(request, function(results, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                self.clearOverlays();
                                self.Establishments.removeAll();
                                for (var i = 0; i < results.length; i++) {
                                    var place = results[i];
                                    self.AddEstablishment(place);
                                }
                                try {
                                    if (self.carousel) {
                                        self.carousel.unload(self.carouselConfig);
                                    }
                                    self.carousel = new Stepcarousel();
                                    self.carousel.setup(self.carouselConfig);
                                } catch (e) {

                                }

                            }
                        });
                    } catch(e) {
                        console.error(e.toString());
                    }
                });
            }
        });
    };
}


