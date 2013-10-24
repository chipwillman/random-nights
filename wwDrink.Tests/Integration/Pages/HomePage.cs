using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace wwDrink.Tests.Integration.Pages
{
    using OpenQA.Selenium;

    using wwDrink.Tests.Integration.Entity;

    public class HomePage : BasePage
    {
        public static IWebDriver Driver { get; set; }
        public static HomePage NavigateTo(IWebDriver webDriver)
        {
            Driver = webDriver;
            Driver.Navigate().GoToUrl("http://wwDrink.com/");
            var homePage = new HomePage();
            homePage.GetElements();
            return homePage;
        }

        public override void GetElements()
        {
            if (Driver != null)
            {
            }
        }

        public void SetSearch(SearchFor searchFor)
        {
            var searchTextBox = Driver.FindElement(By.Id("SearchTextBox"));
            searchTextBox.SendKeys(searchFor.SearchText);
        }

        public SearchPage Search()
        {
            Driver.FindElement(By.Id("SearchButton")).Click();
            var result = new SearchPage();
            result.GetElements();
            return result;
        }
    }
}
