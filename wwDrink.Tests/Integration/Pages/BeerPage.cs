namespace wwDrink.Tests.Integration.Pages
{
    using System.Collections.Generic;
    using System.Collections.Specialized;
    using System.Linq;
    using System.Threading;

    using OpenQA.Selenium;

    using wwDrink.Tests.Integration.Entity;

    public class BeerPage : BasePage
    {
        public static IWebDriver Driver { get; set; }
        public DrinkResults DrinkResults { get; set; }

        public override void GetElements()
        {
            var drinks = new List<Drink>();
            var drinkHeadings = Driver.FindElements(By.CssSelector("h3 > a"));
            foreach (var link in drinkHeadings)
            {
                drinks.Add(new Drink { Name = link.Text });
            }

            var reviews = new List<Review>();
            var reviewDivs = Driver.FindElements(By.CssSelector("div.beverage-review-body span"));
            foreach (var review in reviewDivs)
            {
                reviews.Add(new Review { ReviewText = review.Text });
            }
            DrinkResults = new DrinkResults { Drinks = drinks.ToArray(), Reviews = reviews.ToArray() };
            DrinkResults.SearchButtonVisible = Driver.FindElements(By.Id("search_button")).Any();
            DrinkResults.Title = Driver.FindElement(By.CssSelector("h2")).Text;
        }

        public BeerPage SearchForDrink(string drink)
        {
            var searchBox = Driver.FindElement(By.Id("search_query"));
            searchBox.Click();
            searchBox.Clear();
            searchBox.SendKeys(drink);
            searchBox.SendKeys("\n");

            Driver.FindElement(By.Id("search_button")).Click();

            Thread.Sleep(800);
            var result = new BeerPage();
            result.GetElements();
            return result;
        }

        public BeerPage EnterDrinkReview(string drink, string reviewText)
        {
            this.SearchForDrink(drink);

            Driver.FindElement(By.Id("search_button")).Click();

            Thread.Sleep(100);
            Driver.FindElement(By.LinkText(drink)).Click();

            Driver.FindElement(By.Id("ShowAddReviewButton")).Click();

            Driver.FindElement(By.Id("ReviewText")).SendKeys(reviewText);

            Driver.FindElement(By.Id("AddReviewButton")).Click();

            Thread.Sleep(100);
            var result = new BeerPage();
            result.GetElements();
            return result;
        }
    }
}
