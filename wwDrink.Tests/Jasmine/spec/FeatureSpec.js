/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Establishment.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Review.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Aspect.js" />

var screenName = "";

describe("Establishment Feature Model", function () {
    var featureModel;
    beforeEach(function () {
        featureModel = new EstablishmentFeature();
    });

    it("holds the name", function () {
        featureModel.Name("Restaurant");
        expect(featureModel.Name()).toBe("Restaurant", "Failed to set establishment feature name");
    });

    it("holds the a unique identifier", function () {
        featureModel.PK(new Guid("D3A30338-F4A0-4006-A8B3-D72F86CD6C6C"));
        expect(featureModel.PK().toString()).toBe("D3A30338-F4A0-4006-A8B3-D72F86CD6C6C", "Failed to set PK");
    });

    describe("interaction with establishment reviews", function() {
        var establishment;
        beforeEach(function () {
            establishment = new Establishment();
            var feature = new EstablishmentFeature();
            feature.Name("restaurant");
            establishment.features.push(feature);
        });
        
        it("should calculate the restaurant rating from reviews", function () {
            var reviewAspect = new ReviewAspect();
            reviewAspect.aspectType("Food");
            reviewAspect.rating(2.5);
            var review = new Review();
            review.aspects.push(reviewAspect);
            
            reviewAspect = new ReviewAspect();
            reviewAspect.aspectType("Service");
            reviewAspect.rating(4.5);
            review.aspects.push(reviewAspect);
            establishment.reviews.push(review);
            expect(establishment.features()[0].Rating()).toBe(3.5, "failed to calculate rating");
        });
    });
});