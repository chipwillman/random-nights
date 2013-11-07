namespace wwDrink.Scrapers.Barnivore
{
    public class BeerListingPageScraper : DrinksListingPageScraper
    {
        public override string DrinkType
        {
            get
            {
                return "beer";
            }
        }
    }
}
