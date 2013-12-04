namespace wwDrink.Tests.Integration.Pages
{
    using System;
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

        public EstablishmentDetails SelectEstablishment()
        {
            var resultsDivs = Driver.FindElements(By.ClassName("establishment"));
            for (int i = 0; i < resultsDivs.Count; i++)
            {
                var div = resultsDivs[i];
                div.Click();
                break;
            }

            Thread.Sleep(100);
            Driver.FindElement(By.ClassName("establishmentInfoWindowImage")).Click();
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
                try
                {
                    reviewList.Add(review.Text);
                }
                catch (Exception)
                {
                }
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
