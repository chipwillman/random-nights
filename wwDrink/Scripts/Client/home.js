var search_view_model = new EstablishmentSearch();

$(function () {
    $("#results_tabs").tabs();
});

var slideBeginX;
function touchStart(event) {
    event.preventDefault();//always prevent default Safari actions
    slideBeginX = event.targetTouches[0].pageX;
};

function touchMove(event) {
    event.preventDefault();
    // whatever you want to add here
};

function touchEnd(event) {
    event.preventDefault();
    var slideEndX = event.changedTouches[0].pageX;

    // Now add a minimum slide distance so that the links on the page are still clickable
    if (Math.abs(slideEndX - slideBeginX) > 200) {
        if (slideEndX - slideBeginX > 0) {
            // It means the user has scrolled from left to right
        } else {
            // It means the user has scrolled from right to left.
        };
    };
};

search_view_model.init_autocomplete();

ko.applyBindings(search_view_model);

