function GoogleMapProvider() {
    var self = this;
    self.Listeners = [];

    self.latitude = function() {
        return self.googleMap.getCenter().lat();
    };

    self.longitude = function() {
        return self.googleMap.getCenter().lng();
    };

    self.bounds = function() {
        return self.googleMap.getBounds();
    };

    self.radius = function () {
        var radius = 500;
        if (self.bounds()) {
            radius = self.GetDistanceInMeters(self.bounds().getNorthEast().lat(), self.bounds().getSouthWest().lat(), self.bounds().getNorthEast().lng(), self.bounds().getSouthWest().lng());
            //if (radius > 5000.0) {
            //    radius = 5000.0;
            //}
        }
        return radius;
    };
    
    self.geocoder = {};
    self.googleMap = {};

    self.initializeMapProvider = function(latitude, longitude, mapChangedCallback) {
        var currentLocation = new google.maps.LatLng(latitude, longitude);
        self.googleMap = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: currentLocation,
            zoom: 15
        });
        self.geocoder = new google.maps.Geocoder();
        google.maps.event.addListener(self.googleMap, 'dragend', mapChangedCallback);
        google.maps.event.addListener(self.googleMap, 'zoom_changed', mapChangedCallback);
    };

    self.CreateMarker = function(establishment, requestEstablishmentDetailsCallback) {
        var placeLoc = new google.maps.LatLng(establishment.latitude(), establishment.longitude());

        var marker = new google.maps.Marker({
            map: self.googleMap,
            position: placeLoc
        });

        self.Listeners.push(marker);
        establishment.googleMap = self.googleMap;
        establishment.marker = marker;
        google.maps.event.addListener(marker, 'click', function () {
            if (!establishment.detailsRequested()) {
                requestEstablishmentDetailsCallback(establishment);
            }
            establishment.ShowInfoWindow();
        });
    };

    self.GeocodeAddress = function(searchString, successCallback, failureCallback) {
        self.geocoder.geocode({ 'address': searchString }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude;
                var longitude;
                var radius = 0;
                var bounds;
                if (results[0].geometry.location) {
                    self.googleMap.setCenter(results[0].geometry.location);
                    latitude = results[0].geometry.location.lat();
                    longitude = results[0].geometry.location.lng();
                } else {
                    latitude = null;
                    longitude = null;
                }
                if (results[0].geometry.bounds) {
                    bounds = results[0].geometry.bounds;
                    if (latitude == null) {
                        latitude = results[0].geometry.bounds.getCenter().lat();
                    }
                    if (longitude == null) {
                        longitude = results[0].geometry.bounds.getCenter().lng();
                    }
                    radius = self.GetDistanceInMeters(results[0].geometry.bounds.getNorthEast().lat(), results[0].geometry.bounds.getSouthWest().lat(), results[0].geometry.bounds.getNorthEast().lng(), results[0].geometry.bounds.getSouthWest().lng());
                    if (radius > 5000.0) {
                        radius = 5000.0;
                    } else {
                        self.googleMap.fitBounds(results[0].geometry.bounds);
                    }
                } else {
                    bounds = null;
                }
                if (successCallback != undefined) {
                    successCallback(latitude, longitude, radius, bounds);
                }
            } else {
                failureCallback();
            }
        });
    };

    self.CenterMap = function(lat, lon, radius) {
        self.googleMap.setCenter(new google.maps.LatLng(lat, lon));
    };
    
    self.GetDistanceInMeters = function (lat1, lat2, lon1, lon2) {
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
 
    self.clearOverlays = function () {
        for (var i = 0; i < self.Listeners.length; i++) {
            self.Listeners[i].setMap(null);
        }
        self.Listeners = [];
    };


}