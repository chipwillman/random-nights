﻿var search_view_model = new EstablishmentSearch();

$(function () {
    $("#results_tabs").tabs();
});

ko.applyBindings(search_view_model);

search_view_model.init_google();
