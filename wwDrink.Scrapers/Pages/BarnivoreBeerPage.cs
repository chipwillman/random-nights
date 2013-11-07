namespace wwDrink.Scrapers.Pages
{
    using System;
    using System.Collections.Generic;

    using OpenQA.Selenium;

    using wwDrink.Scrapers.Entities;

    public class BarnivoreBeerPage
    {
        public string FilterByLetter { get; set; }
        public string FilterByCountry { get; set; }

        public DrinkDetails[] Drinks { get; set; }
        
        public static IWebDriver Driver { get; set; }
        public static BarnivoreBeerPage NavigateTo(IWebDriver webDriver)
        {
            Driver = webDriver;
            Driver.Navigate().GoToUrl("http://www.barnivore.com/beer");
            var homePage = new BarnivoreBeerPage();
            homePage.GetElements();
            return homePage;
        }

        public bool IgnoreCountry { get; set; }

        private void GetElements()
        {
            this.FilterByLetter = Driver.FindElement(By.CssSelector(".filter a.active")).Text;
            if (!IgnoreCountry)
            {
                this.FilterByCountry = Driver.FindElement(By.Id("region")).Text;
            }
            var beers = Driver.FindElements(By.CssSelector(".name a"));
            var breweries =
                Driver.FindElements(By.CssSelector("li > div:nth-child(3) > div:nth-child(2) > a:nth-child(1)"));
            var drinkList = new List<DrinkDetails>();
            for (int i = 0; i < beers.Count; i++)
            {
                var beer = beers[i];
                var brewery = breweries[i];
                var details = new DrinkDetails();
                details.Name = beer.Text;
                details.BarnBeerLink = beer.GetAttribute("href");
                details.Brewer = brewery.Text;
                details.BarnBrewerLink = brewery.GetAttribute("href");
                drinkList.Add(details);
            }
            this.Drinks = drinkList.ToArray();
        }

        public bool HasNextButton()
        {
            try
            {
                var element = Driver.FindElement(By.CssSelector(".next > a"));
                return element != null;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public BarnivoreBeerPage Next()
        {
            Driver.FindElement(By.CssSelector(".next > a")).Click();
            var result = new BarnivoreBeerPage { IgnoreCountry = true };
            result.GetElements();
            return result;
        }

        public BarnivoreBeerPage SelectLetterFilter(string link)
        {
            Driver.FindElement(By.LinkText(link)).Click();
            var result = new BarnivoreBeerPage { IgnoreCountry = true };
            result.GetElements();
            return result;
        }

        public BarnivoreBeerPage SelectWines()
        {
            Driver.FindElement(By.LinkText("Wine")).Click();
            var result = new BarnivoreBeerPage();
            result.GetElements();
            return result;
        }

        public BarnivoreBeerPage SelectLiquor()
        {
            Driver.FindElement(By.LinkText("Liquor")).Click();
            var result = new BarnivoreBeerPage() { IgnoreCountry = true };
            result.GetElements();
            return result;
        }

    }
}
