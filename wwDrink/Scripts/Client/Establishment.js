function Establishment() {
    var self = this;
    self.PK = ko.observable();
    self.detailsRequested = ko.observable(false);
    self.name = ko.observable();
    self.latitude = ko.observable();
    self.longitude = ko.observable();
    self.suburb = ko.observable();
    self.imageUrl = ko.observable();
    self.open = ko.observable();
    self.closed = function() { return !self.open; };
    self.index = ko.observable();
    self.google_id = ko.observable();
    self.google_reference = ko.observable();

    self.address = ko.observable();

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
        var result = hourString + ":" + minuteString + amPm;
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