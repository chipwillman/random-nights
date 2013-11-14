ko.bindingHandlers.rateit = {
    init: function (element, valueAccessor) {
        var local = ko.toJS(valueAccessor()),
            options = {};

        if (typeof local === 'number') {
            local = {
                value: local
            };
        }

        ko.utils.extend(options, ko.bindingHandlers.rateit.options);
        ko.utils.extend(options, local);

        $(element).rateit(options);
        //register an event handler to update the viewmodel when the view is updated.
        $(element).bind('rated', function (event, value) {
            var floa = parseFloat(value.toFixed(1));
            var observable = valueAccessor();
            if (ko.isObservable(observable)) {
                observable(floa);
            } else {
                if (observable.value !== undefined && ko.isObservable(observable.value)) {
                    observable.value(floa);
                }
            }
        });
    },
    update: function (element, valueAccessor) {
        var local = ko.toJS(valueAccessor());

        if (typeof local === 'number') {
            local = {
                value: local
            };
        }
        if (local.value !== undefined) {
            var floa = parseFloat(local.value.toFixed(1));
            $(element).rateit('value', floa);
        }

    },
    options: {
        //this section is to allow users to override the rateit defaults on a per site basis.
        //override by adding ko.bindingHandlers.rateit.options = { ... }
    }
};

ko.bindingHandlers.slider = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().sliderOptions || {};
        $(element).slider(options);
        ko.utils.registerEventHandler(element, "slidechange", function (event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).slider("destroy");
        });
        ko.utils.registerEventHandler(element, "slide", function (event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(value)) value = 0;
        $(element).slider("value", value);
    }
};

ko.bindingHandlers.slider_disabled = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().sliderOptions || {};
        $(element).slider(options);
        $(element).slider("disable");
        ko.utils.registerEventHandler(element, "slidechange", function (event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).slider("destroy");
        });
        ko.utils.registerEventHandler(element, "slide", function (event, ui) {
            var observable = valueAccessor();
            observable(ui.value);
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (isNaN(value)) value = 0;
        $(element).slider("value", value);
    }
};

