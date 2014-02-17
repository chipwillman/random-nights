var wine_model = new DrinkListing();
wine_model.drinkType("wine");
wine_model.DefaultImage = "/Images/Default_wine.png";

wine_model.drinkSearches = [
    "Shiraz",
    "Pinot",
    "Merlot",
    "Chardonnay",
    "Rose"
];

ko.applyBindings(wine_model);

wine_model.ShowRandomDrink();

$("#loading_div").show();
