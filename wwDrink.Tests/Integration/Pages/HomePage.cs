namespace wwDrink.Tests.Integration.Pages
{
    using System;
    using System.Threading;

    using OpenQA.Selenium;

    using wwDrink.Tests.Integration.Entity;

    public class HomePage : BasePage
    {
        public static IWebDriver Driver { get; set; }
        public static HomePage NavigateTo(IWebDriver webDriver)
        {
            Driver = webDriver;
            Driver.Navigate().GoToUrl("http://www.wwDrink.com/");
            var homePage = new HomePage();
            homePage.GetElements();
            return homePage;
        }

        public bool UserLoggedOn { get; set; }

        public override void GetElements()
        {
            if (Driver != null)
            {
                try
                {
                    if (Driver.PageSource.Contains("Log off"))
                    {
                        UserLoggedOn = true;
                    }
                }
                catch (Exception)
                {
                    UserLoggedOn = false;
                }
            }
        }

        public HomePage LogOff()
        {
            var logOffLink = Driver.FindElement(By.Id("logout_link"));
            logOffLink.Click();
            var homePage = new HomePage();
            homePage.GetElements();
            return homePage;
        }

        public LoginPage LogOn()
        {
            var logOnLink = Driver.FindElement(By.Id("loginLink"));
            logOnLink.Click();
            LoginPage.Driver = Driver;
            var result = new LoginPage();
            result.GetElements();
            return result;
        }

        public void SetSearch(SearchFor searchFor)
        {
            var searchTextBox = Driver.FindElement(By.Id("search_query"));
            searchTextBox.Clear();
            searchTextBox.SendKeys(searchFor.SearchText);
        }

        public SearchPage Search()
        {
            var searchButton = Driver.FindElement(By.Id("search_button"));
            searchButton.Click();
            SearchPage.Driver = Driver;
            var result = new SearchPage();
            result.GetElements();
            return result;
        }

        public RegisterPage ClickRegister()
        {
            var registerButton = Driver.FindElement(By.Id("registerLink"));
            registerButton.Click();
            Thread.Sleep(100);

            RegisterPage.Driver = Driver;
            var result = new RegisterPage();
            result.GetElements();
            return result;
        }

        public ManageUserPage ManageUser()
        {
            Driver.FindElement(By.Id("ManageUser")).Click();
            var result = new ManageUserPage();
            result.GetElements();
            return result;
        }
    }
}
