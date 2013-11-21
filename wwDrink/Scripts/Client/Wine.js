var wine_model = new DrinkListing();
wine_model.drinkType("wine");
wine_model.DefaultImage = "/Images/NoImageWine.png";

ko.applyBindings(wine_model);

$("#loading_div").show();
