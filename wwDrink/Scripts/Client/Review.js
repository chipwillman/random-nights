function ReviewAspect() {
    var self = this;
    self.pk = ko.observable();
    self.aspectType = ko.observable();
    self.rating = ko.observable();
}

function Review() {
    var self = this;
    self.pk = ko.observable();
    self.review = ko.observable();
    self.review_short = ko.computed(function () {
        if (self.review()) {
            if (self.review().length > 500)
            {
                return self.review().substring(0, 500);
            }
            return self.review();
        }
        return "";
    });
    self.author = ko.observable();
    self.authorUrl = ko.observable();
    self.date = ko.observable();
    self.rating = ko.observable();
    self.aspects = ko.observableArray();

    self.ShowShortReview = ko.observable(true);
    self.ShowFullReview = ko.observable(false);

    self.EstablishmentFk = ko.observable();
    self.ReviewLikeHref = ko.computed(function () {
        return "http://www.wwDrink.com/Home/Review/" + self.pk();
    });
    self.fbLinkId = ko.computed(function() {
        return "fb" + self.pk();
    });
    self.ShowLikeReview = ko.computed(function() {
        return self.pk() != undefined;
    });
    self.ShowMoreButton = ko.computed(function () {
        if (self.review()) {
            return (self.review().length > 500) && self.ShowShortReview();
        }
        return false;
    });
    self.ShowLessButton = ko.computed(function () {
        if (self.review()) {
            return (self.review().length > 500) && self.ShowFullReview();
        }
        return false;
    });
    self.ToggleReview = function () {
        self.ShowFullReview(!self.ShowFullReview());
        self.ShowShortReview(!self.ShowFullReview());
    };
}

