namespace wwDrink.Scrapers.Pages
{
    using OpenQA.Selenium;

    public class BarnivoreHomePage
    {
        public static IWebDriver Driver { get; set; }
        public static BarnivoreHomePage NavigateTo(IWebDriver webDriver)
        {
            Driver = webDriver;
            Driver.Navigate().GoToUrl("http://www.wwDrink.com/");
            var homePage = new BarnivoreHomePage();
            homePage.GetElements();
            return homePage;
        }

        private void GetElements()
        {
        }
    }
}
