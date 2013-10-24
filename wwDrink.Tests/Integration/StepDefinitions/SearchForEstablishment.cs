namespace wwDrink.Tests.Integration.StepDefinitions
{
    using System.Linq;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using OpenQA.Selenium;
    using OpenQA.Selenium.Firefox;

    using TechTalk.SpecFlow;

    using wwDrink.Tests.Integration.Entity;
    using wwDrink.Tests.Integration.Pages;

    [Binding]
    public class SearchForEstablishment
    {
        // For additional details on SpecFlow step definitions see http://go.specflow.org/doc-stepdef
        private HomePage homePage;
        private IWebDriver driver;

        private SearchPage searchPage;

        [BeforeScenario()]
        public void Setup()
        {
            driver = new FirefoxDriver();
        }

        [AfterScenario()]
        public void TearDown()
        {
            driver.Quit();
        }

        [Given(@"I navigate to wwDrink")]
        public void GivenIGoTo()
        {
            this.homePage = HomePage.NavigateTo(driver);
        }

        [Given(@"I search for ""(.*)""")]
        public void GivenISearchFor(string searchString)
        {
            var searchEntity = new SearchFor { SearchText = searchString };

            this.homePage.SetSearch(searchEntity);
        }

        [When(@"I press the search button")]
        public void WhenIPressTheSearchButton()
        {
            searchPage = homePage.Search();
        }

        [Then(@"the results should contain ""(.*)""")]
        public void ThenTheResultsShouldContain(string textToFind)
        {
            Assert.IsNotNull(searchPage.SearchResults.PlacesFound.FirstOrDefault(loc => loc.Contains(textToFind)));
        }
    }
}
