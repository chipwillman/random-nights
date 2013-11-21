var beer_model = new DrinkListing();
beer_model.drinkType("beer");
beer_model.DefaultImage = "/Images/NoImageBeer.png";

ko.applyBindings(beer_model);

$("#loading_div").show();
