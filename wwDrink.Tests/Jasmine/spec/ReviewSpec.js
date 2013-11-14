/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Review.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Establishment.js" />

describe("review", function () {
    var review;
    beforeEach(function () {
        review = new Review();
    });

    it("allows the addition of establishments to Interests", function () {
        var establishment = new Establishment({ name: "An Establishment", latitude: "-37.794322", longitude: "144.928571" });

        var requestMoreInformation = review.SelectEstablishment(establishment);
        expect(requestMoreInformation).toBe(true, "As no features are present, the establishment request more information");
    });

    describe("knockout binding requirements", function () {
        beforeEach(function () {
            review = new EstablishmentSearch();
        });

        it("has bound fields", function () {
            expect(review.searchText).toBeDefined();
        });
    });
});