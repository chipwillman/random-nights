namespace wwDrink.Tests.Integration.Pages
{
    using System;

    using OpenQA.Selenium;

    public class ManageUserPage : BasePage
    {
        public static IWebDriver Driver { get; set; }

        public string AgeRange { get; set; }
        public string ScreenName { get; set; }

        public bool ClassicRockExcluded { get; set; }
        public bool ClassicRockRequired { get; set; }
        public bool CountryHighlyDesired { get; set; }
        public bool BluesExluded { get; set; }
        public bool LesbisnPreferenceRequired { get; set; }

        public static ManageUserPage NavigateTo(IWebDriver webDriver)
        {
            Driver = webDriver;
            Driver.Navigate().GoToUrl("http://wwDrink.com/Account/Manage");
            var manageUserPage = new ManageUserPage();
            manageUserPage.GetElements();
            return manageUserPage;
        }

        public override void GetElements()
        {
            if (Driver != null)
            {
                try
                {
                    ScreenName = Driver.FindElement(By.Id("screen_name_readonly")).Text;
                    AgeRange = Driver.FindElement(By.Id("age_range_readonly")).Text;
                    this.ClassicRockExcluded = Driver.FindElement(By.Id("ClassicRock_exclude_checkbox")).GetAttribute("value") == "on";
                    this.ClassicRockRequired = Driver.FindElement(By.Id("ClassicRock_require_checkbox")).GetAttribute("value") == "on";
                    this.LesbisnPreferenceRequired = Driver.FindElement(By.Id("Lesbian_exclude_readonly_checkbox")).GetAttribute("value") == "on";
                    this.BluesExluded = Driver.FindElement(By.Id("Blues_exclude_readonly_checkbox")).GetAttribute("value") == "on";
                    this.CountryHighlyDesired =
                        Driver.FindElement(By.Id("Country_readonly_factor")).GetAttribute("value") == "80";
                }
                catch (Exception)
                {
                }
            }
        }

        public void SetAgeRange(string ageRange)
        {
            IWebElement selectAgeList = Driver.FindElement(By.Id("age_range_select"));
            selectAgeList.SendKeys(ageRange);
        }

        public ManageUserPage SaveDetails()
        {
            Driver.FindElement(By.Id("save_details")).Click();
            
            var manageUserPage = new ManageUserPage();
            manageUserPage.GetElements();
            return manageUserPage;
        }

        public void EditPersonalDetails()
        {
            Driver.FindElement(By.Id("edit_details")).Click();
        }

        public void SetScreenName(string screenName)
        {
            var screenNameInput = Driver.FindElement(By.Id("screen_name"));
            screenNameInput.Clear();
            screenNameInput.SendKeys(screenName);
            this.ScreenName = Driver.FindElement(By.Id("screen_name")).Text;
        }

        public void SelectRequiredLesbianPreference()
        {
            Driver.FindElement(By.Id("Lesbian_enable_checkbox")).Click();
            Driver.FindElement(By.Id("Lesbian_require_checkbox")).Click();
        }

        public void SetExcluded(string action)
        {
            Driver.FindElement(By.Id(action + "_enable_checkbox")).Click();
            Driver.FindElement(By.Id(action + "_exclude_checkbox")).Click();
        }

        public void SetRequired(string action)
        {
            Driver.FindElement(By.Id(action + "_enable_checkbox")).Click();
            Driver.FindElement(By.Id(action + "_require_checkbox")).Click();
        }

        public void SetHighlyDesired(string action)
        {
            Driver.FindElement(By.Id(action + "_enable_checkbox")).Click();
            Driver.FindElement(By.Id(action + "_factor")).Clear();
            Driver.FindElement(By.Id(action + "_factor")).SendKeys("80");
        }
    }
}
