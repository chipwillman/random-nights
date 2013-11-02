namespace wwDrink.Tests.Integration.StepDefinitions
{
    using System.Threading;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using TechTalk.SpecFlow;

    using wwDrink.Tests.Integration.Entity;
    using wwDrink.Tests.Integration.Pages;
    using wwDrink.Tests.Integration.Support;

    [Binding]
    public class EditPersonalPreferencesSteps
    {
        private HomePage homePage;

        private LoginPage loginPage;

        private ManageUserPage manageUserPage;

        private RegisterPage registerPage;

        public string UserName = "peter.pubgoer";

        public string Password = "234jkdssi$";

        [Given(@"I am at the manage user page")]
        public void GivenIAmAtTheManageUserPage()
        {
            EnsureCurrentUser(UserName, Password);
            ManageUserPage.Driver = BrowserDriver.Driver;
            this.manageUserPage = this.homePage.ManageUser();
        }
        
        [When(@"I select an age range")]
        public void WhenISelectAnAgeRange()
        {
            this.manageUserPage.EditPersonalDetails();
            this.manageUserPage.SetAgeRange("29 - 35");
        }
        
        [When(@"I press Save Details")]
        public void WhenIPressSaveDetails()
        {
            this.manageUserPage = manageUserPage.SaveDetails();
            Thread.Sleep(200);
        }
        
        [When(@"I change my screen name")]
        public void WhenIChangeMyScreenName()
        {
            this.manageUserPage.EditPersonalDetails();
            this.manageUserPage.SetScreenName("Britanica");
        }
        
        [When(@"I select my sexual preference")]
        public void WhenISelectMySexualPreference()
        {
            this.manageUserPage.EditPersonalDetails();
            this.manageUserPage.SelectRequiredLesbianPreference();
        }
        
        [Then(@"my age range should be set")]
        public void ThenMyAgeRangeShouldBeSet()
        {
            Assert.AreEqual("29-35", this.manageUserPage.AgeRange);
        }
        
        [Then(@"my new screen name should be set")]
        public void ThenMyNewScreenNameShouldBeSet()
        {
            Assert.AreEqual("Britanica", this.manageUserPage.ScreenName);
        }
        
        [Then(@"my sexual preference should be set")]
        public void ThenMySexualPreferenceShouldBeSet()
        {
            Assert.IsTrue(this.manageUserPage.LesbisnPreferenceRequired);
        }

        [When(@"I set ""(.*)"" to ""(.*)""")]
        public void WhenISetTo(string elementName, string action)
        {
            this.manageUserPage.EditPersonalDetails();
            if (action == "Exclude")
            {
                manageUserPage.SetExcluded(elementName.Replace(" ", ""));
            }
            else if (action == "Require")
            {
                manageUserPage.SetRequired(elementName.Replace(" ", ""));
            }
            else if (action == "Highly Desired")
            {
                manageUserPage.SetHighlyDesired(elementName.Replace(" ", ""));
            }
        }

        [Then(@"I should see ""(.*)"" as ""(.*)""")]
        public void ThenIShouldSeeAs(string elementName, string action)
        {
            if (action == "Excluded")
            {
                switch (elementName)
                {
                    case "Classic Rock": Assert.IsTrue(manageUserPage.ClassicRockExcluded);
                        break;
                    case "Blues": Assert.IsTrue(manageUserPage.BluesExluded);
                        break;
                }
            }
            else if (action == "Required")
            {
                switch (elementName)
                {
                    case "Classic Rock": Assert.IsTrue(manageUserPage.ClassicRockRequired);
                        break;
                }
            }
            else if (action == "Highly Desired")
            {
                switch (elementName)
                {
                    case "Country": Assert.IsTrue(manageUserPage.CountryHighlyDesired);
                        break;
                }
            }
        }


        #region Implementation

        private void EnsureCurrentUser(string userName, string password)
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            if (homePage.UserLoggedOn)
            {
                this.homePage = this.homePage.LogOff();
            }
            registerPage = homePage.ClickRegister();
            this.homePage = registerPage.Register(new RegisterDetails { Username = userName, Password = password, ConfirmPassword = password });
            if (!homePage.UserLoggedOn)
            {
                this.loginPage = this.homePage.LogOn();
            }
            this.homePage = loginPage.Login(new LoginDetails { Username = userName, Password = password });
        }

        #endregion
    }
}
