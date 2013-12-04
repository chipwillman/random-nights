/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Aspect.js" />

describe("Aspect Model", function() {
    var aspectModel;
    beforeEach(function () {
        aspectModel = new Aspect();
    });
    
    it("holds the name", function () {
        aspectModel.Name("Pool Tables");
        expect(aspectModel.Name()).toBe("Pool Tables", "Failed to set aspect name");
    });

    it("holds the a unique identifier", function () {
        aspectModel.PK(new Guid("1483D320-4869-4DF0-B32C-FFFC9ED954CD"));
        expect(aspectModel.PK().toString()).toBe("1483D320-4869-4DF0-B32C-FFFC9ED954CD", "Failed to set PK");
    });
});