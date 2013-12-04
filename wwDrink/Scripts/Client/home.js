var search_view_model = new EstablishmentSearch();

$(function () {
    $("#results_tabs").tabs();
});

search_view_model.init_autocomplete();

ko.applyBindings(search_view_model);
