function DrinkListing() {
    var self = this;

    self.drinkType = ko.observable();
    self.Query = ko.observable();
    self.PageSize = ko.observable(20);
    self.StartPage = ko.observable(0);
    self.Pages = ko.observable(0);
    self.ResultCount = ko.observable(0);
    self.DefaultImage = {};

    self.FirstButtonVisible = ko.computed(function () {
        return self.Pages() > 1;
    });

    self.PrevButtonVisible = ko.computed(function () {
        return self.StartPage() > 1;
    });
    
    self.NextButtonVisible = ko.computed(function () {
        return self.Pages() > self.StartPage();
    });
    
    self.LastButtonVisible = ko.computed(function () {
        return self.Pages() > 1;
    });

    self.DrinkResults = ko.observableArray();

    self.AddDrink = function(drink) {
        var d = new Drink();
        d.DefaultImage(self.DefaultImage);
        d.Name(drink.Name);
        d.PK(drink.DrinkPk);
        if (drink.Crafter) {
            d.Brewery(drink.Crafter.Name);
            d.Address(drink.Crafter.Address);
            d.Phone(drink.Crafter.Phone);
            d.Fax(drink.Crafter.Fax);
            d.Email(drink.Crafter.Email);
            if (drink.MainImageUrl != null) {
                d.MainImageUrl(drink.MainImageUrl);
            }
            d.Url(drink.Crafter.Url);
            d.Vegan(drink.Vegan);
        }
        self.DrinkResults.push(d);
    };

    self.SearchDrink = function () {
        self.DoSearch(1, self.PageSize());
    };
    
    self.DoSearch = function(pageNumber, pageSize) {
        var wwDrinkSearch = "/api/Drinks?Query=" + self.Query() + "&type=" + self.drinkType() + "&page=" + pageNumber + "&pageSize=" + pageSize;
        $.getJSON(wwDrinkSearch, function (data) {
            try {
                self.DrinkResults.removeAll();
                for (var i = 0; i < data.Drinks.length; i++) {
                    self.AddDrink(data.Drinks[i]);
                }
                if (data.Pagination != null) {
                    self.ResultCount(data.Pagination.Results);
                    self.StartPage(data.Pagination.Page);
                    self.Pages(data.Pagination.Pages);
                }
            } catch (e) {
                console.error(e.toString());
            }
        });
    };

    self.FirstClick = function() {
        self.StartPage(1);
        self.DoSearch(self.StartPage(), self.PageSize());
    };

    self.NextClick = function() {
        self.StartPage(self.StartPage() + 1);
        self.DoSearch(self.StartPage(), self.PageSize());
    };
    
    self.PrevClick = function () {
        self.StartPage(self.StartPage() - 1);
        self.DoSearch(self.StartPage(), self.PageSize());
    };

    self.LastClick = function () {
        self.StartPage(self.Pages());
        self.DoSearch(self.StartPage(), self.PageSize());
    };

    self.ShowRandomDrink = function () {
        if (self.drinkSearches.length > 0) {
            var random = Math.floor(Math.random() * self.drinkSearches.length);

            self.Query(self.drinkSearches[random]);
            self.DoSearch(1, 20);
        }
    };

    self.AddReviewClick = function () {
        var beverage = this;
        var wwDrinkReview = "/api/Review";

        var review = {
            pk: Guid.create().toString(),
            reviewText: beverage.ReviewText(),
            rating: beverage.Rating(),
            parentFk: beverage.PK().toString(),
            parentTable: "Drink"
        };
        $.post(wwDrinkReview, review, function (data) {
            if (data) {
                beverage.AddingReview(false);
                var date = new Date(data.ReviewDate);
                var review = new Review();
                review.rating(data.Rating);
                review.review(data.ReviewText);
                review.author(data.Profile.UserName);
                review.date(date.toLocaleDateString());
                beverage.reviews.unshift(review);
            }
        });
    };
}