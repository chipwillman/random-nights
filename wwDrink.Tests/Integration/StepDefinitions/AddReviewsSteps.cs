using System;
using TechTalk.SpecFlow;

namespace wwDrink.Tests.Integration.StepDefinitions
{
    using System.Linq;

    using Microsoft.VisualStudio.TestTools.UnitTesting;

    using wwDrink.Tests.Integration.Entity;
    using wwDrink.Tests.Integration.Pages;
    using wwDrink.Tests.Integration.Support;

    [Binding]
    public class AddReviewsSteps : AuthenticatedPageSteps
    {
        private SearchPage searchPage;

        private BeerPage beerPage;

        private string username;

        private string password = "wwDrink";

        private string establishment = "Hardiman";

        private string reviewText =
            "This rugged establishment in often changing week by week. They offer great live music most nights.";

        private string beverageReviewText = "This is a good review for a good brew.";

        private EstablishmentDetails establishmentsDetails;

        [Given(@"I have a new registered user")]
        public void GivenIHaveANewRegisteredUser()
        {
            this.username = Guid.NewGuid().ToString().Replace("-", "");
            this.EnsureCurrentUser(username, password);
        }
        
        [Given(@"I am at an establishments details page")]
        public void GivenIAmAtAnEstablishmentsDetailsPage()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            homePage.SetSearch(new SearchFor { SearchText = "Kensington, Australia"});
            this.searchPage = homePage.Search();
            this.searchPage.SelectEstablishment();
        }
        
        [Given(@"I am at a beverage detail page")]
        public void GivenIAmAtABeverageDetailPage()
        {
            this.homePage = HomePage.NavigateTo(BrowserDriver.Driver);
            this.beerPage = this.homePage.ClickDrink("Beer");
        }
        
        [When(@"I enter an establishment review")]
        public void WhenIEnterAnEstablishmentReview()
        {
            this.establishmentsDetails =  this.searchPage.EnterReview(this.reviewText);
            Assert.IsTrue(this.establishmentsDetails.Reviews.Any(s => s == reviewText));
        }
        
        [When(@"I enter a beverage review")]
        public void WhenIEnterABeverageReview()
        {
            this.beerPage = this.beerPage.EnterDrinkReview("Toohey's Old", this.beverageReviewText);
            Assert.IsTrue(this.beerPage.DrinkResults.Reviews.Any(s => s.ReviewText == this.beverageReviewText));
        }
        
        [Then(@"others should be able to view my establishment review")]
        public void ThenOthersShouldBeAbleToViewMyEstablishmentReview()
        {
            this.homePage = this.homePage.LogOff();
            this.username = Guid.NewGuid().ToString().Replace("-", "");
            this.EnsureCurrentUser(this.username, this.password);
            this.homePage.SetSearch(new SearchFor { SearchText = "Kensington, Australia" });
            this.searchPage = homePage.Search();
            this.establishmentsDetails = this.searchPage.SelectEstablishment();
            Assert.IsTrue(this.establishmentsDetails.Reviews.Any(s => s == reviewText));
        }
        
        [Then(@"others should be able to view my beverage review")]
        public void ThenOthersShouldBeAbleToViewMyBeverageReview()
        {
            this.homePage = this.homePage.LogOff();
            this.username = Guid.NewGuid().ToString().Replace("-", "");
            this.EnsureCurrentUser(this.username, this.password);
            this.beerPage = this.homePage.ClickDrink("Beer");
            this.beerPage = this.beerPage.SearchForDrink("Toohey's Old");

        }
    }
}
