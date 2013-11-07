namespace wwDrink.Scrapers.Support
{
    using OpenQA.Selenium;
    using OpenQA.Selenium.Firefox;

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
