namespace wwDrink.Scrapers.Entities
{
    public class DrinkDetails
    {
        public string Name { get; set; } // h1
        public string BarnBeerLink { get; set; }
        public string Brewer { get; set; } //
        public string BarnBrewerLink { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public string BarnivoreBeerId { get; set; }
        public string BarnivoreBreweryId { get; set; }
        public bool Vegan { get; set; }
        public string DrinkType { get; set; }
    }
}
