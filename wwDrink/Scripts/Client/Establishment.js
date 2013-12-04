var missingImageUrl = "/Images/missing_establishment_image.png";

function Establishment(selectEstablishmentCallback) {
    var self = this;
    self.SelectEstablishmentCallback = selectEstablishmentCallback;
    self.PK = ko.observable();
    self.detailsRequested = ko.observable(false);
    self.source = ko.observable(false);
    self.name = ko.observable();
    self.latitude = ko.observable();
    self.longitude = ko.observable();
    self.suburb = ko.observable();
    self.imageUrl = ko.observable(missingImageUrl);
    self.open = ko.observable();
    self.closed = function() { return !self.open; };
    self.index = ko.observable();
    self.google_id = ko.observable();
    self.google_reference = ko.observable();

    self.address = ko.observable();
    self.address_street_number = ko.observable();
    self.address_street = ko.observable();
    self.address_city = ko.observable();
    self.address_state = ko.observable();
    self.address_country = ko.observable();
    self.address_post_code = ko.observable();

    self.features = ko.observableArray();
    self.open_hours = ko.observableArray();
    self.photos = ko.observableArray();
    self.reviews = ko.observableArray();

    self.tab_href = ko.observable();
    self.tab_name = ko.observable();
    
    self.UpdateImage = function () {
        var link = this;
        self.imageUrl(link.imageUrl);
    };

    self.Rating = ko.observable(3);
    self.WebSite = ko.observable();

    self.SearchAspect = ko.observable();

    self.AddingReview = ko.observable(false);
    self.NotAddingReview = ko.observable(true);
    self.ReviewRating = ko.observable(3);
    self.ReviewText = ko.observable();
    self.ReviewAspects = ko.observableArray();
    self.fbLinkId = ko.computed(function() {
        return "fbLink" + self.PK();
    });
    self.EstablishmentLikeHref = ko.computed(function() {
        return "http://www.wwDrink.com/Home/Show/" + self.PK();
    });

    self.ShowAddReviewClick = function () {
        self.AddingReview(true);
        self.NotAddingReview(false);
    };

    self.GetEstablishmentFeatures = function() {
        var result = [];
        for (var aspect in self.ReviewAspects()) {
            var feature = self.ReviewAspects()[aspect];
            result.push({ Name: feature.Name(), Rating: feature.Rating() });
        }

        return result;
    };

    self.ShowFacebookLike = ko.computed(function() {
        return self.source();
    });

    self.AddAspectVisible = ko.computed(function() {
        var result = true;
        if (self.ReviewAspects().length >= 3) {
            result = false;
        }
        return result;
    });

    self.AddAspect = function () {
        for (var i = 0; i < availableAspects.length; i++) {
            var feature = availableAspects[i];
            if (feature == self.SearchAspect()) {
                var establishmentFeature = new EstablishmentFeature();
                establishmentFeature.Name(self.SearchAspect());
                self.ReviewAspects.push(establishmentFeature);
                self.SearchAspect("");
                break;
            }
        }
    };

    self.DeleteAspect = function () {
        var establishmentFeature = this;
        self.ReviewAspects.remove(establishmentFeature);
    };

    self.AddPhoto = function (imageUrl) {
        for (var i = self.photos().length - 1; i > -1; i--) {
            if (self.photos()[i].imageUrl == imageUrl)
                return;
        }
        self.photos.push({ imageUrl: imageUrl });
        if (self.imageUrl() == missingImageUrl) {
            self.imageUrl(imageUrl);
        }
    };

    self.InsertReview = function(review) {
        for (var i = self.reviews().length - 1; i > -1; i--) {
            if (self.reviews()[i].author() == review.author()) {
                self.reviews().splice(i, 1);
                break;
            }
        }
        self.reviews.unshift(review);
    };

    self.AddReview = function (review) {
        for (var i = self.reviews().length - 1; i > -1; i--) {
            if (self.reviews()[i].author() == review.author())
                return;
        }
        self.reviews.push(review);

        // fbLinkId
        //$('div#' + review.pk() + ' .fb-like').attr('data-href', review.ReviewLikeHref());
        //FB.XFBML.parse(document.getElementById(review.pk()));
    };

    self.marker = {};
    self.googleMap = {};
    self.ShowInfoWindow = function () {

        var content = '    <div id="establishmentInfoWindow">' +
            '<div class="establishment-open"  data-bind="visible: open()"><span>Open</span></div>' +
            '<div class="establishment-closed" data-bind="visible: !open()"><span>Currently Closed</span></div>' +
            '<div class="establishment">' +
            '    <h4 data-bind="text: name"></h4>' +
            '    <img class="establishmentInfoWindowImage" data-bind="attr:{src: imageUrl}, click: ShowEstablishmentDetails" alt="loading image" width="174" height="102" /><br/>' +
            '    <span data-bind="text: suburb"> </span>' +
            '</div>' +
            '</div>';

        infowindow.setContent(content);
        infowindow.open(self.googleMap, self.marker);
        // bind knockout when dom is ready
        
        var listener = google.maps.event.addListener(infowindow, 'domready', function () {
            var element = $('#establishmentInfoWindow')[0];
            ko.cleanNode(element);
            ko.applyBindings(self, document.getElementById("establishmentInfoWindow"));
            google.maps.event.removeListener(listener);
        });
    };

    self.AllowAddReview = ko.computed(function () {
        var result = screenName != "";
        for (var i in self.reviews()) {
            var review = self.reviews()[i];
            if (review.author() == screenName) {
                result = false;
            }
        }
        return result;
    });

    self.ShowEstablishmentDetails = function () {
        if (self.SelectEstablishmentCallback) {
            self.SelectEstablishmentCallback(self);
        }
    };
}

function OpenHours() {
    var self = this;
    self.start_day_begin = ko.observable();
    self.start_day_end = ko.observable();
    self.end_day_begin = ko.observable();
    self.end_day_end = ko.observable();
    self.start_hour = ko.observable();
    self.start_minute = ko.observable();
    self.end_hour = ko.observable();
    self.end_minute = ko.observable();

    self.getDay = function (day) {
        switch (day) {
            case 0: return "Mon";
            case 1: return "Tue";
            case 2: return "Wed";
            case 3: return "Thu";
            case 4: return "Fri";
            case 5: return "Sat";
            case 6: return "Sun";
        }
        return "NAD";
    };

    self.getTime = function (hour, minute) {
        var result = "";
        if (hour != null && minute != null) {
            var amPm = " pm";
            var hourString = hour.toString();
            var minuteString = "00";
            if (minute != 0) {
                minuteString = minute.toString();
            }
            if (hour >= 12) {
                if (hour != 12)
                    hourString = (hour - 12).toString();
            } else {
                amPm = " am";
                if (hour == 0) {
                    hourString = "12";
                }
            }
            result = hourString + ":" + minuteString + amPm;
        }
        return result;
    };

    self.open_hours = ko.computed(function () {
        var result = "";
        try {
            //if (self.start_day_begin() && self.start_day_end() && self.start_minute() && self.end_hour() && self.end_minute()) {
                result = self.getDay(self.start_day_begin());
                if (self.start_day_begin() != self.start_day_end()) {
                    result += "-" + self.getDay(self.start_day_end());
                }
                result += " " + self.getTime(self.start_hour(), self.start_minute()) + "-" + self.getTime(self.end_hour(), self.end_minute());
            //}
        }
        catch (exception)
        {
            console.log(exception.toString());
        }
        return result;
    });
}