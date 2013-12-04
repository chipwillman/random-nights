/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Review.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Establishment.js" />

var screenName = "";

describe("review", function () {
    var review;
    beforeEach(function () {
        review = new Review();
    });

    describe("knockout binding requirements", function () {
        it("has bound fields", function () {
            expect(review.review).toBeDefined();
        });
    });
});