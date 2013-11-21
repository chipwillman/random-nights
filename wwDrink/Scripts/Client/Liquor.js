var liqour_model = new DrinkListing();
liqour_model.drinkType("liqour");
liqour_model.DefaultImage = "/Images/NoImageSpirits.png";

ko.applyBindings(liqour_model);

$("#loading_div").show();