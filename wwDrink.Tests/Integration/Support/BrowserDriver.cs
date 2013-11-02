namespace wwDrink.Tests.Integration.Support
{
    using OpenQA.Selenium;
    using OpenQA.Selenium.Firefox;

    using TechTalk.SpecFlow;

    public class BrowserDriver
    {
        public static IWebDriver Driver
        {
            get
            {
                if (driver == null)
                {
                    driver = new FirefoxDriver();
                }
                return driver;
            }
        }

        [AfterScenario()]
        public static void Quit()
        {
            if (driver != null)
            {
                driver.Quit();
                driver = null;
            }
        }

        private static IWebDriver driver;


    }
}
