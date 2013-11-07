function Drink() {
    var self = this;
    self.PK = ko.observable();
    self.Name = ko.observable();
    self.Vegan = ko.observable(false);
    self.Brewery = ko.observable("Brewery Not Set");
    self.Address = ko.observable("Address Not Set");
    self.Phone = ko.observable("Phone Not Set");
    self.Fax = ko.observable("Fax not set");
    self.Email = ko.observable("Email not set");
    self.Url = ko.observable("Url not set");
    
    self.ShowDetails = ko.observable(false);

    self.ShowDetailsClick = function() {
        self.ShowDetails(!self.ShowDetails());
    };
}