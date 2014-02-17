var beer_model = new DrinkListing();
beer_model.drinkType("beer");
beer_model.DefaultImage = "/Images/Default_Beer.png";
beer_model.drinkSearches = [
    "Lager",
    "Stout",
    "Toohey",
    "Coors",
    "Brew"
];

ko.applyBindings(beer_model);

beer_model.ShowRandomDrink();

$("#loading_div").show();
