namespace wwDrink.Tests.Integration.Pages
{
    using System.Collections.Generic;
    using System.Linq;

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

        public EstablishmentDetails SelectEstablishment(string establishment)
        {
            var resultsDivs = Driver.FindElements(By.ClassName("establishment"));
            foreach (var div in resultsDivs)
            {
                if (div.Text.StartsWith(establishment))
                {
                    div.Click();
                    break;
                }
            }
            var tabPageLinks = Driver.FindElements(By.CssSelector(".tab-header a"));
            foreach (var link in tabPageLinks)
            {
                if (link.Text == establishment)
                {
                    link.Click();
                    break;
                }
            }
            return this.GetEstablishmentDetails();
        }

        #region Implementation

        private SearchResults GetSearchResults()
        {
            var resultsDivs = Driver.FindElements(By.ClassName("establishment"));
            var result = new SearchResults { PlacesFound = resultsDivs.Select(div => div.Text).ToArray() };
            return result;
        }

        private EstablishmentDetails GetEstablishmentDetails()
        {
            var result = new EstablishmentDetails();
            var mainImage = Driver.FindElement(By.CssSelector(".establishment-details-current-image"));
            result.ImageUrl = mainImage.GetAttribute("src");
            var imageUrls = new List<string>();
            var thumbnails = Driver.FindElements(By.CssSelector(".establishment-image-thumbnails img"));
            foreach (var thumbnail in thumbnails)
            {
                imageUrls.Add(thumbnail.GetAttribute("src"));
            }

            result.Photos = imageUrls.ToArray();
            return result;
        }

        #endregion

        public EstablishmentDetails SelectSecondThumbnail()
        {
            var thumbnails = Driver.FindElements(By.CssSelector(".establishment-image-thumbnails img"));
            thumbnails[1].Click();
            return this.GetEstablishmentDetails();
        }
    }
}
