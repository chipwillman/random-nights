var liqour_model = new DrinkListing();
liqour_model.drinkType("liqour");
liqour_model.DefaultImage = "/Images/Default_SpiritShot.png";

liqour_model.drinkSearches = [
    "Bourbon",
    "Irish",
    "Spiced",
    "Vodka",
    "Rum"
];

ko.applyBindings(liqour_model);

liqour_model.ShowRandomDrink();

$("#loading_div").show();