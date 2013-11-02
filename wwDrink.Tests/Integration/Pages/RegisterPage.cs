namespace wwDrink.Tests.Integration.Pages
{
    using OpenQA.Selenium;

    using wwDrink.Tests.Integration.Entity;

    public class RegisterPage : BasePage
    {
        public static IWebDriver Driver { get; set; }

        public RegisterDetails RegisterForm { get; set; }

        public override void GetElements()
        {
            RegisterForm = this.GetRegisterForm();
        }

        private RegisterDetails GetRegisterForm()
        {
            var result = new RegisterDetails();
            result.Title = Driver.FindElement(By.CssSelector("h1")).Text;
            return result;
        }

        public HomePage Register(RegisterDetails registerDetails)
        {
            Driver.FindElement(By.Id("UserName")).SendKeys(registerDetails.Username);
            Driver.FindElement(By.Id("Password")).SendKeys(registerDetails.Password);
            Driver.FindElement(By.Id("ConfirmPassword")).SendKeys(registerDetails.ConfirmPassword);
            Driver.FindElement(By.Id("RegisterButton")).Click();

            return HomePage.NavigateTo(Driver);
        }
    }
}
