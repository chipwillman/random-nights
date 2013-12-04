/// <reference path="../../../wwDrink/Scripts/guid.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-1.7.1.js" />
/// <reference path="../../../wwDrink/Scripts/jquery-ui-1.8.20.js" />
/// <reference path="../../../wwDrink/Scripts/knockout-2.1.0.js" />
/// <reference path="../../../wwDrink/Scripts/Stepcarousel.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Establishment.js" />
/// <reference path="../../../wwDrink/Scripts/Client/Search.js" />

var screenName = "";

describe("Search Model", function () {
    var searchModel;
    beforeEach(function () {
        searchModel = new EstablishmentSearch();
    });

    it("allows the addition of establishments to Interests", function () {
        var establishment = new Establishment({ name: "An Establishment", latitude: "-37.794322", longitude: "144.928571" });

        searchModel.Interests().push(establishment);
        expect(searchModel.Interests().length).toBe(1, "Failed to add an establishment");
    });

    describe("knockout binding requirements", function () {
        beforeEach(function () {
            searchModel = new EstablishmentSearch();
        });

        it("has bound fields", function () {
            expect(searchModel.searchText).toBeDefined();
        });
    });

    describe("interaction with google maps", function() {
        beforeEach(function () {
            searchModel = new EstablishmentSearch();
        });

        it("listens for search text changing", function() {
            searchModel.LocationChanged(false);
            searchModel.searchText("Golden, Colorado");
            expect(searchModel.LocationChanged()).toBe(true, "Failed to notice the search text changing");
        });

        describe("holds parses information from an ip lookup", function() {
            beforeEach(function () {
                searchModel = new EstablishmentSearch();
            });
            
            it ("parses information from a successful lookup", function() {
                var successfulLookup = "Country: AUSTRALIA (AU)\n\
City: Melbourne\n\
\n\
Latitude: -37.7833\n\
Longitude: 144.967\n\
IP: 203.100.247.203";
                searchModel.ParseHostLookup(successfulLookup);
                expect(searchModel.latitude()).toBe("-37.7833", "latitude");
                expect(searchModel.longitude()).toBe("144.967", "longitude");
                expect(searchModel.country_name()).toBe("AUSTRALIA (AU)", "country name");
                expect(searchModel.city()).toBe("Melbourne", "city");
                expect(searchModel.ip_address()).toBe("203.100.247.203", "ip_address");
            });

            it("parses information from a country only returned lookup", function () {
                var unknownCityLookup = "Country: UNITED STATES (US)\n\
City: (Unknown city)\n\
\n\
Latitude: \n\
Longitude: \n\
IP: 54.201.146.244\n";
                searchModel.ParseHostLookup(unknownCityLookup);
                expect(searchModel.latitude()).toBe("", "latitude");
                expect(searchModel.longitude()).toBe("", "longitude");
                expect(searchModel.country_name()).toBe("UNITED STATES (US)", "country name");
                expect(searchModel.city()).toBe("", "city");
                expect(searchModel.ip_address()).toBe("54.201.146.244", "ip_address");
            });
            
            it("parses information from an unsuccessful lookup", function () {
                var unknownCountryLookup = "Country: (Unknown country) (XX)\n\
City: (Unknown city)\n\
\n\
Latitude: \n\
Longitude: \n\
IP: 51.102.74.51\n";
                searchModel.ParseHostLookup(unknownCountryLookup);
                expect(searchModel.latitude()).toBe("", "latitude");
                expect(searchModel.longitude()).toBe("", "longitude");
                expect(searchModel.country_name()).toBe("", "country name");
                expect(searchModel.city()).toBe("", "city");
                expect(searchModel.ip_address()).toBe("51.102.74.51", "ip_address");
            });
        });
    });
});