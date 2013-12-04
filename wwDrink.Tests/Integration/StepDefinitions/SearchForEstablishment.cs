namespace wwDrink.Tests.Integration.StepDefinitions
{
    using System.Linq;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using OpenQA.Selenium;
    using OpenQA.Selenium.Firefox;

    using TechTalk.SpecFlow;

    using wwDrink.Tests.Integration.Entity;
    using wwDrink.Tests.Integration.Pages;
    using wwDrink.Tests.Integration.Support;

    [Binding]
    public class SearchForEstablishment
    {
        // For additional details on SpecFlow step definitions see http://go.specflow.org/doc-stepdef
        private HomePage homePage;

        private SearchPage searchPage;

        private LoginPage loginPage;

        private RegisterPage registerPage;

        [Given(@"I navigate to wwDrink")]
        public void GivenIGoTo()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
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
            this.searchPage = homePage.Search();
        }

        [Then(@"the results should contain ""(.*)""")]
        public void ThenTheResultsShouldContain(string textToFind)
        {
            Assert.IsNotNull(searchPage.SearchResults.PlacesFound.FirstOrDefault(loc => loc.Contains(textToFind)));
        }

        [Given(@"I am not logged in")]
        public void GivenIAmNotLoggedIn()
        {
            if (this.homePage.UserLoggedOn)
            {
                homePage.LogOff();
            }
        }

        [When(@"I press Log in")]
        public void WhenIPressLogIn()
        {
            loginPage = homePage.LogOn();
        }

        [Then(@"I should be presented with the ability to log on with facebook")]
        public void ThenIShouldBePresentedWithTheAbilityToLogOnWithFacebook()
        {
            Assert.IsTrue(loginPage.LoginForm.AlternateLoginServices[0] == "Facebook");
        }

        [When(@"I press Register")]
        public void WhenIPressRegister()
        {
            registerPage = homePage.ClickRegister();
        }

        [Then(@"I should redirected to the register page")]
        public void ThenIShouldRedirectedToTheRegisterPage()
        {
            Assert.AreEqual("Register at wwDrink.", registerPage.RegisterForm.Title);
        }

        [Given(@"User Credential Exist")]
        public void GivenUserCredentialExist()
        {
            var userName = "Spec_Flow_Test";
            var password = "Chris123$";
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            registerPage = homePage.ClickRegister();

            registerPage.Register(new RegisterDetails { Username = userName, Password = password, ConfirmPassword = password });
            // DataSteps.ConfirmUser();
        }

        [When(@"Enter my user credentials")]
        public void WhenEnterMyUserCredentials()
        {
            this.loginPage = homePage.LogOn();
            homePage = this.loginPage.Login(new LoginDetails() { Username = "Spec_Flow_Test", Password = "Chris123$" });
        }

        [Then(@"I should return to the home page logged on")]
        public void ThenIShouldReturnToTheHomePageLoggedOn()
        {
            Assert.IsTrue(homePage.UserLoggedOn);
        }
    }
}
