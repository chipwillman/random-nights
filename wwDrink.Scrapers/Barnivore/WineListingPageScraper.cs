namespace wwDrink.Scrapers.Barnivore
{
    public class WineListingPageScraper : DrinksListingPageScraper
    {
        public override string DrinkType
        {
            get
            {
                return "wine";
            }
        }
    }
}
