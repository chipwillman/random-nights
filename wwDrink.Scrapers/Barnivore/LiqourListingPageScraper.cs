namespace wwDrink.Scrapers.Barnivore
{
    public class LiqourListingPageScraper : DrinksListingPageScraper
    {
        public override string DrinkType
        {
            get
            {
                return "liqour";
            }
        }
    }
}
