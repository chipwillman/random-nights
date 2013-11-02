using System;
using TechTalk.SpecFlow;

namespace wwDrink.Tests.Integration.StepDefinitions
{
    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using wwDrink.Tests.Integration.Entity;
    using wwDrink.Tests.Integration.Pages;
    using wwDrink.Tests.Integration.Support;

    [Binding]
    public class AdditionalPicturesSteps
    {
        private HomePage homePage;

        private SearchPage searchPage;

        private EstablishmentDetails detailResult;

        [Given(@"I have opened a detail page")]
        public void GivenIHaveOpenedADetailPage()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            this.homePage.SetSearch(new SearchFor() { SearchText = "Melbourne, Australia" });
            this.searchPage = this.homePage.Search();
            this.detailResult = this.searchPage.SelectEstablishment("MoVida");
            Assert.IsTrue(detailResult.Photos.Length > 1);
        }
        
        [When(@"I press click an additional image")]
        public void WhenIPressClickAnAdditionalImage()
        {
            this.detailResult = this.searchPage.SelectSecondThumbnail();
        }
        
        [Then(@"the esatblishment image change to a larger image of the thumbnail")]
        public void ThenTheEsatblishmentImageChangeToALargerImageOfTheThumbnail()
        {
            Assert.AreEqual(this.detailResult.ImageUrl, this.detailResult.Photos[1]);
            Assert.AreNotEqual(this.detailResult.ImageUrl, this.detailResult.Photos[0]);
        }
    }
}
