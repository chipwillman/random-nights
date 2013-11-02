function FavoriteAspect() {
    var self = this;
    self.cssClass = ko.computed(function() {
        if (self.UserPreferencePk != "") {
            return "favorite-enabled";
        }
        return "favorite-disabled";
    });
    self.Name = ko.observable("");
    self.Enabled = ko.observable(false);
    self.AspectFk = ko.observable();
    self.UserPreferencePk = ko.observable("");
    self.Required = ko.observable(false);
    self.Excluded = ko.observable(false);
    self.Factor = ko.observable(50.0);
    self.EnableCheckboxId = ko.computed(function () { return self.Name().replace(" ", "") + "_enable_checkbox"; });
    self.ExcludeCheckboxId = ko.computed(function () { return self.Name().replace(" ", "") + "_exclude_checkbox"; });
    self.RequireCheckboxId = ko.computed(function () { return self.Name().replace(" ", "") + "_require_checkbox"; });
    self.FactorId = ko.computed(function() { return self.Name().replace(" ", "") + "_factor"; });
    self.EnableCheckboxReadonlyId = ko.computed(function () { return self.Name().replace(" ", "") + "_enable_readonly_checkbox"; });
    self.ExcludedCheckboxReadonlyId = ko.computed(function () { return self.Name().replace(" ", "") + "_exclude_readonly_checkbox"; });
    self.RequiredCheckboxReadonlyId = ko.computed(function () { return self.Name().replace(" ", "") + "_require_readonly_checkbox"; });
    self.FactorReadonlyId = ko.computed(function () { return self.Name().replace(" ", "") + "_readonly_factor"; });
}