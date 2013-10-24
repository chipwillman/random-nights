/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Client/manageuser.js" />

describe("user Model", function () {
    var userModel;
    beforeEach(function () {
        userModel = new ManageUsers();
    });

    describe("has preferrences", function() {
        it("in the category personal details", function() {
            expect(userModel.ageRange).toBeDefined();
        });
    });
});