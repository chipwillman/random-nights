namespace wwDrink.Tests.Integration.Pages
{
    using System.Collections.Generic;
    using System.Collections.ObjectModel;

    using OpenQA.Selenium;

    using wwDrink.Tests.Integration.Entity;

    public class LoginPage : BasePage
    {
        public static IWebDriver Driver { get; set; }

        public LoginResults LoginForm { get; set; }

        public override void GetElements()
        {
            LoginForm = this.GetLoginForm();
        }

        private LoginResults GetLoginForm()
        {
            var result = new LoginResults();
            var strings = new List<string>();
            var socialLoginList = Driver.FindElements(By.CssSelector("#socialLoginList button"));
            foreach (var button in socialLoginList)
            {
                strings.Add(button.Text);
            }
            result.AlternateLoginServices = new ReadOnlyCollection<string>(strings);

            return result;
        }

        public HomePage Login(LoginDetails loginDetails)
        {
            Driver.FindElement(By.Id("UserName")).SendKeys(loginDetails.Username);
            Driver.FindElement(By.Id("Password")).SendKeys(loginDetails.Password);
            Driver.FindElement(By.Id("LoginButton")).Click();
            var result = new HomePage();
            result.GetElements();
            return result;
        }
    }
}
