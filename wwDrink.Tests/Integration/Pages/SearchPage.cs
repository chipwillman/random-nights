namespace wwDrink.Tests.Integration.Pages
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;

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
                if (div.Text.Contains(establishment))
                {
                    div.Click();
                    break;
                }
            }
            Thread.Sleep(100);
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

            var reviews = Driver.FindElements(By.CssSelector("div.establishment-reviews span"));
            var reviewList = new List<string>();
            foreach (var review in reviews)
            {
                reviewList.Add(review.Text);
            }
            result.Reviews = reviewList.ToArray();
            return result;
        }

        #endregion

        public EstablishmentDetails SelectSecondThumbnail()
        {
            var thumbnails = Driver.FindElements(By.CssSelector(".establishment-image-thumbnails img"));
            thumbnails[1].Click();
            return this.GetEstablishmentDetails();
        }

        public EstablishmentDetails EnterReview(string reviewText)
        {
            Driver.FindElement(By.Id("ShowAddReviewButton")).Click();

            Driver.FindElement(By.Id("ReviewText")).SendKeys(reviewText);

            Driver.FindElement(By.Id("AddReviewButton")).Click();
            Thread.Sleep(100);
            return this.GetEstablishmentDetails();
        }
    }
}
