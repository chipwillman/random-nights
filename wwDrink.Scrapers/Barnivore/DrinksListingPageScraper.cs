namespace wwDrink.Scrapers.Barnivore
{
    using System;
    using System.Collections.Generic;

    using OpenQA.Selenium;
    using OpenQA.Selenium.Firefox;

    using wwDrink.Scrapers.Entities;

    public abstract class DrinksListingPageScraper : IDisposable
    {
        public IWebDriver Driver
        {
            get
            {
                return this.driver ?? (this.driver = new FirefoxDriver());
            }
        }

        private IWebDriver driver;

        public abstract string DrinkType { get; }

        public void Dispose()
        {
            if (driver != null)
            {
                driver.Quit();
                driver = null;
            }
        }

        public DrinkDetails[] GetDrinks(DrinkDetails[] beerLinks)
        {
            var result = new List<DrinkDetails>();
            foreach (var link in beerLinks)
            {
                var drink = GetDrinkDetails(link);
                result.Add(drink);
            }
            return result.ToArray();
        }

        private DrinkDetails GetDrinkDetails(DrinkDetails details)
        {
            Driver.Navigate().GoToUrl(details.BarnBeerLink);
            var result = new DrinkDetails { BarnivoreBeerId = this.ExtractIdFromLink(details.BarnBeerLink) };
            var breweryLink = details.BarnBrewerLink;

            result.Name = details.Name;
            result.BarnivoreBreweryId = ExtractBreweryIdFromLink(breweryLink);
            result.Brewer = details.Brewer;
            result.Address = Driver.FindElement(By.CssSelector(".contact_info > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)")).Text;
            result.Phone = Driver.FindElement(By.CssSelector(".contact_info > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)")).Text;
            result.Fax = Driver.FindElement(By.CssSelector(".contact_info > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)")).Text;
            result.Email = Driver.FindElement(By.CssSelector(".contact_info > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)")).Text;
            result.Url = Driver.FindElement(By.CssSelector(".contact_info > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)")).Text;
            result.Vegan = Driver.FindElement(By.CssSelector("#content > h1:nth-child(2)")).Text.Contains("is Vegan Friendly");
            result.DrinkType = this.DrinkType;
            result.BarnBeerLink = details.BarnBeerLink;
            result.BarnBrewerLink = details.BarnBrewerLink;
            return result;
        }

        private string ExtractBreweryIdFromLink(string link)
        {
            string result;
            try
            {
                string Prefix = "http://www.barnivore.com/" + DrinkType + "/";
                result = link.Substring(Prefix.Length, link.IndexOf("/", Prefix.Length + 2, StringComparison.Ordinal) - Prefix.Length);
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return result;
        }

        private string ExtractIdFromLink(string link)
        {
            string result;
            try
            {
                const string Prefix = "http://www.barnivore.com/products/";
                result = link.Substring(Prefix.Length, link.IndexOf("-", StringComparison.Ordinal) - Prefix.Length);
            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }
            return result;
        }
    }
}
