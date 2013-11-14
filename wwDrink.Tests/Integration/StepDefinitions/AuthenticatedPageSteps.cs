namespace wwDrink.Tests.Integration.StepDefinitions
{
    using wwDrink.Tests.Integration.Entity;
    using wwDrink.Tests.Integration.Pages;
    using wwDrink.Tests.Integration.Support;

    public class AuthenticatedPageSteps
    {
        protected HomePage homePage;

        private LoginPage loginPage;

        private RegisterPage registerPage;

        protected void EnsureCurrentUser(string userName, string password)
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            if (this.homePage.UserLoggedOn)
            {
                this.homePage = this.homePage.LogOff();
            }
            this.registerPage = this.homePage.ClickRegister();
            this.homePage = this.registerPage.Register(new RegisterDetails { Username = userName, Password = password, ConfirmPassword = password });
            if (!this.homePage.UserLoggedOn)
            {
                this.loginPage = this.homePage.LogOn();
                this.homePage = this.loginPage.Login(new LoginDetails { Username = userName, Password = password });
            }
        }
    }
}
