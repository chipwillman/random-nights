namespace wwDrink.Tests.Integration.Pages
{
    using System.Collections.Generic;

    using OpenQA.Selenium;

    using wwDrink.Tests.Integration.Entity;

    public class SearchPage : BasePage
    {
        public static IWebDriver Driver { get; set; }
        public SearchResults SearchResults { get; set; }

        public override void GetElements()
        {
            SearchResults = this.GetSearchResults();
        }

        #region Implementation

        private SearchResults GetSearchResults()
        {
            var resultsDivs = Driver.FindElements(By.ClassName("establishment"));
            var placesFound = new List<string>();
            foreach (var div in resultsDivs)
            {
                placesFound.Add(div.Text);
            }
            var result = new SearchResults { PlacesFound = placesFound.ToArray() };
            return result;
        }

        #endregion
    }
}
