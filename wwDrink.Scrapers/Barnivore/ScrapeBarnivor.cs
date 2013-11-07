namespace wwDrink.Scrapers.Barnivore
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using wwDrink.Scrapers.Entities;
    using wwDrink.Scrapers.Models;
    using wwDrink.Scrapers.Pages;
    using wwDrink.Scrapers.Support;

    [TestClass]
    public class ScrapeBarnivor
    {
        private BarnivoreBeerPage barnivoreBeerpage;

        [TestCleanup]
        public void Cleanup()
        {
            BrowserDriver.Driver.Quit();
        }
        
        [Timeout(TestTimeout.Infinite)]
        [TestMethod]
        public void GetBeers()
        {
            InitializeDatabase();
            this.barnivoreBeerpage = BarnivoreBeerPage.NavigateTo(BrowserDriver.Driver);
            var links = new[] { "A-F", "G-L", "M-R", "S-T", "U-Z", "0-9" };
            foreach (var link in links)
            {
                this.barnivoreBeerpage = this.barnivoreBeerpage.SelectLetterFilter(link);

                DrinkDetails[] beerDetails;
                using (var scrapper = new BeerListingPageScraper())
                {
                    beerDetails = scrapper.GetDrinks(this.barnivoreBeerpage.Drinks);
                    this.SaveDrinks(beerDetails);
                }
                while (this.barnivoreBeerpage.HasNextButton())
                {
                    this.barnivoreBeerpage = this.barnivoreBeerpage.Next();
                    using (var scrapper = new BeerListingPageScraper())
                    {
                        beerDetails = scrapper.GetDrinks(this.barnivoreBeerpage.Drinks);
                        this.SaveDrinks(beerDetails);
                    }
                }
            }
        }

        [Timeout(TestTimeout.Infinite)]
        [TestMethod]
        public void GetWines()
        {
            InitializeDatabase();
            this.barnivoreBeerpage = BarnivoreBeerPage.NavigateTo(BrowserDriver.Driver);
            this.barnivoreBeerpage.SelectWines();
            var links = new[] { /* "A-F", */ "G-L", "M-R", "S-T", "U-Z", "0-9" };
            foreach (var link in links)
            {
                this.barnivoreBeerpage = this.barnivoreBeerpage.SelectLetterFilter(link);

                DrinkDetails[] wineDetails;
                using (var scrapper = new WineListingPageScraper())
                {
                    wineDetails = scrapper.GetDrinks(this.barnivoreBeerpage.Drinks);
                    this.SaveDrinks(wineDetails);
                }
                while (this.barnivoreBeerpage.HasNextButton())
                {
                    this.barnivoreBeerpage = this.barnivoreBeerpage.Next();
                    using (var scrapper = new WineListingPageScraper())
                    {
                        wineDetails = scrapper.GetDrinks(this.barnivoreBeerpage.Drinks);
                        this.SaveDrinks(wineDetails);
                    }
                }
            }
        }

        [Timeout(TestTimeout.Infinite)]
        [TestMethod]
        public void GetLiqour()
        {
            InitializeDatabase();
            this.barnivoreBeerpage = BarnivoreBeerPage.NavigateTo(BrowserDriver.Driver);
            this.barnivoreBeerpage.SelectLiquor();
            var links = new[] { "A-F", "G-L", "M-R", "S-T", "U-Z", "0-9" };
            foreach (var link in links)
            {
                this.barnivoreBeerpage = this.barnivoreBeerpage.SelectLetterFilter(link);

                DrinkDetails[] liqourDetails;
                using (var scrapper = new LiqourListingPageScraper())
                {
                    liqourDetails = scrapper.GetDrinks(this.barnivoreBeerpage.Drinks);
                    this.SaveDrinks(liqourDetails);
                }
                while (this.barnivoreBeerpage.HasNextButton())
                {
                    this.barnivoreBeerpage = this.barnivoreBeerpage.Next();
                    using (var scrapper = new LiqourListingPageScraper())
                    {
                        liqourDetails = scrapper.GetDrinks(this.barnivoreBeerpage.Drinks);
                        this.SaveDrinks(liqourDetails);
                    }
                }
            }
        }

        private void SaveDrinks(IEnumerable<DrinkDetails> drinksDetails)
        {
            var breweries = GetBreweries(drinksDetails);
            foreach (var brewery in breweries)
            {
                var existing = db.Breweries.FirstOrDefault(b => b.BarnivoreId == brewery.BarnivoreId);
                if (existing != null)
                {
                    existing.Address = brewery.Address;
                    existing.Email = brewery.Email;
                    existing.Fax = brewery.Fax;
                    existing.Name = brewery.Name;
                    existing.Phone = brewery.Phone;
                    existing.Url = brewery.Url;
                }
                else
                {
                    db.Breweries.Add(brewery);
                }
            }
            db.SaveChanges();

            var drinks = GetDrinks(drinksDetails);
            foreach (var drink in drinks)
            {
                var existing = db.Drinks.FirstOrDefault(b => b.BarnivoreId == drink.BarnivoreId);
                if (existing != null)
                {
                    existing.Name = drink.Name;
                    existing.BreweryId = drink.BreweryId;
                    existing.Vegan = drink.Vegan;
                }
                else
                {
                    db.Drinks.Add(drink);
                }
            }
            db.SaveChanges();

        }

        private Drink[] GetDrinks(IEnumerable<DrinkDetails> drinksDetails)
        {
            var result = new Dictionary<int, Drink>();
            foreach (var drinkDetails in drinksDetails)
            {
                int drinkId;
                if (int.TryParse(drinkDetails.BarnivoreBeerId, out drinkId) && drinkId  > 0 && !result.ContainsKey(drinkId))
                {
                    try
                    {
                        var drink = new Drink();
                        drink.BarnivoreId = drinkId;
                        drink.Name = drinkDetails.Name;
                        drink.Vegan = drinkDetails.Vegan;
                        drink.Type = drinkDetails.DrinkType;
                        int breweryId;
                        if (int.TryParse(drinkDetails.BarnivoreBreweryId, out breweryId))
                        {
                            drink.BreweryId = breweryId;
                        }
                        result.Add(drink.BarnivoreId, drink);
                    }
                    catch (ArgumentException)
                    {
                        Console.WriteLine("Duplicate Key detected " + drinkId);
                    }
                }
            }
            return result.Select(p => p.Value).ToArray();
        }

        private Brewery[] GetBreweries(IEnumerable<DrinkDetails> drinks)
        {
            var result = new Dictionary<int, Brewery>();
            foreach (var drink in drinks)
            {
                int breweryId;
                if (int.TryParse(drink.BarnivoreBreweryId, out breweryId) && !result.ContainsKey(breweryId))
                {
                    var brewery = new Brewery();
                    brewery.BarnivoreId = breweryId;
                    brewery.Address = drink.Address;
                    brewery.Email = drink.Email;
                    brewery.Fax = drink.Fax;
                    brewery.Name = drink.Brewer;
                    brewery.Phone = drink.Phone;
                    brewery.Url = drink.Url;
                    result.Add(breweryId, brewery);
                }
            }
            return result.Select(p => p.Value).ToArray();
        }

        private BarnivoreContext db { get; set; }
        private void InitializeDatabase()
        {
            db = new BarnivoreContext();
            db.Database.Initialize(false);
        }
    }
}
