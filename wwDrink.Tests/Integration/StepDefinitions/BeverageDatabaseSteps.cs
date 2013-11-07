using TechTalk.SpecFlow;

namespace wwDrink.Tests.Integration.StepDefinitions
{
    using System.Linq;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using wwDrink.Tests.Integration.Pages;
    using wwDrink.Tests.Integration.Support;

    [Binding]
    public class BeverageDatabaseSteps
    {
        private HomePage homePage;

        private BeerPage drinkPage;

        [Given(@"I have visited wwDrink")]
        public void GivenIHaveVisitedWwDrink()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
        }
        
        [Given(@"I am at the Beer Page")]
        public void GivenIAmAtTheBeerPage()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            this.drinkPage = this.homePage.ClickDrink("Beer");
        }

        [Given(@"I am at the Wine Page")]
        public void GivenIAmAtTheWinePage()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            this.drinkPage = this.homePage.ClickDrink("Wine");
        }

        [Given(@"I am at the Liqour Page")]
        public void GivenIAmAtTheLiqourPage()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            this.drinkPage = this.homePage.ClickDrink("Liqour");
        }

        [When(@"I press the Beer Menu")]
        public void WhenIPressTheBeerMenu()
        {
            this.drinkPage = this.homePage.ClickDrink("Beer");
        }

        [When(@"I press the Wine Menu")]
        public void WhenIPressTheWineMenu()
        {
            this.drinkPage = this.homePage.ClickDrink("Wine");
        }

        [When(@"I press the Liquor Menu")]
        public void WhenIPressTheLiquorMenu()
        {
            this.drinkPage = this.homePage.ClickDrink("Liqour");
        }

        [When(@"I search for (.*)")]
        public void WhenISearchFor(string drink)
        {
            this.drinkPage = this.drinkPage.SearchForDrink(drink);
        }
        
        [Then(@"I should be presented with a search for (.*) page")]
        public void ThenIShouldBePresentedWithASearchForPage(string drink)
        {
            Assert.IsTrue(this.drinkPage.DrinkResults.SearchButtonVisible);
            Assert.AreEqual(drink, this.drinkPage.DrinkResults.Title);
        }

        [Then(@"I should be presented with search results (.*)")]
        public void ThenIShouldBePresentedWith(string drink)
        {
            Assert.IsTrue(this.drinkPage.DrinkResults.Drinks.Any(d => d.Name.Contains(drink)));
        }
    }
}
