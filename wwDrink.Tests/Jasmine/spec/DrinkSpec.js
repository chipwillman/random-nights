/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Review.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Drink.js" />

var screenName = "";

describe("Drink Model", function () {
    var drinkModel;
    beforeEach(function () {
        drinkModel = new Drink();
    });

    it("holds the name", function () {
        drinkModel.Name("Pool Tables");
        expect(drinkModel.Name()).toBe("Pool Tables", "Failed to set aspect name");
    });

    it("holds the a unique identifier", function () {
        drinkModel.PK(new Guid("0363D1BB-CA7F-42C1-817E-CC5B418A7D1C"));
        expect(drinkModel.PK().toString()).toBe("0363D1BB-CA7F-42C1-817E-CC5B418A7D1C", "Failed to set PK");
    });

    it("can map a wwDrink review", function() {
        var review = {
            Rating: 4.5,
            ReviewText: "My favorite beer, any time of the year!",
            Profile: {
                ScreenName: "Britanica"
            },
            ReviewDate: new Date("2013-12-03T09:35:27.953")
        };
        var reviewModel = drinkModel.MapReview(review);
        expect(reviewModel.review()).toBe("My favorite beer, any time of the year!", "Failed to set review");
        expect(reviewModel.rating()).toBe(4.5, "Failed to set rating");
        expect(reviewModel.author()).toBe("Britanica", "Failed to set author");
        expect(reviewModel.date()).toBe(new Date("2013-12-03T09:35:27.953").toLocaleDateString(), "Failed to set date");
    });

    describe("client interaction", function () {
        beforeEach(function () {
            drinkModel.ReviewsRequested = true;
        });

        it("should toggle visibility on show details click", function () {
            drinkModel.ShowDetailsClick();
            expect(drinkModel.ShowDetails()).toBe(true, "Details not shown");
            expect(drinkModel.NotShowDetails()).toBe(false, "inverse of details not shown (this shouldn't be required)");
        });
    });
});