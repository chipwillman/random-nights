var search_view_model = new EstablishmentSearch();

$(function () {
    $("#results_tabs").tabs();
});

search_view_model.init_autocomplete();

ko.applyBindings(search_view_model);

search_view_model.init_google();

if (search_view_model.latitude() != null) {
    search_view_model.Search();
}



