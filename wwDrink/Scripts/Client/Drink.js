function Drink() {
    var self = this;
    self.DefaultImage = "/Images/NoImageBeer.png";
    self.PK = ko.observable();
    self.Name = ko.observable();
    self.Vegan = ko.observable(false);
    self.Brewery = ko.observable("Brewery Not Set");
    self.Address = ko.observable("Address Not Set");
    self.Phone = ko.observable("Phone Not Set");
    self.Fax = ko.observable("Fax not set");
    self.Email = ko.observable("Email not set");
    self.MainImageUrl = ko.observable(self.DefaultImage);
    self.Url = ko.observable("Url not set");
    self.reviews = ko.observableArray();
    self.BeverageRating = ko.observable(3);

    self.ReviewsRequested = false;

    self.ShowDetails = ko.observable(false);
    self.NotShowDetails = ko.observable(true);
    self.Rating = ko.observable(3);
    self.AddingReview = ko.observable(false);
    self.NotAddingReview = ko.observable(false);
    self.ReviewText = ko.observable();

    self.MapReview = function (review) {
        var result = new Review();
        var date = new Date(review.ReviewDate);
        result.review(review.ReviewText);
        result.rating(review.Rating);
        result.author(review.Profile.ScreenName);
        result.date(date.toLocaleDateString());

        return result;
    };

    self.RequestReviews = function () {
        if (!self.ReviewsRequested) {
            self.ReviewsRequested = true;
            var establishmentReviewUrl = "/api/Review?Parent=" + self.PK();
            $.get(establishmentReviewUrl, function(data) {
                if (data) {
                    for (var reviewIndex in data) {
                        var review = self.MapReview(data[reviewIndex]);
                        self.reviews.push(review);
                    }
                }
            });
        }
    };

    self.ShowDetailsClick = function() {
        self.ShowDetails(!self.ShowDetails());
        self.NotShowDetails(!self.ShowDetails());
        self.NotAddingReview(self.ShowDetails());
        self.RequestReviews();
    };

    self.BeverageHeadingClass = ko.computed(function () {
        if (self.ShowDetails()) {
            return "beverage-heading-selected";
        }
        return "beverage-heading";
    });

    self.ShowAddReviewClick = function () {
        self.AddingReview(true);
        self.NotAddingReview(false);
        $('.rateit').rateit({ backingfld: '#ReviewSelect' });
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
}