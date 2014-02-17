function Aspect() {
    var self = this;
    self.PK = ko.observable();
    self.Name = ko.observable();
}

function AspectRating() {
    var self = this;
    self.PK = ko.observable();
    self.AspectFk = ko.observable();
    self.EstablishmentFk = ko.observable();
}

function EstablishmentFeature() {
    var self = this;
    self.PK = ko.observable();
    self.Name = ko.observable();
    self.Rating = ko.observable(0);
}