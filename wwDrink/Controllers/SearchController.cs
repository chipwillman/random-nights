namespace wwDrink.Controllers
{
    using System;
    using System.Data.Spatial;
    using System.Web;
    using System.Web.Http;

    using wwDrink.Models;

    public class SearchController : ApiController
    {
        [HttpGet]
        public SearchModel Index()
        {
            var searchText = HttpContext.Current.Request.QueryString["Query"];
            var latitude = HttpContext.Current.Request.QueryString["Latitude"];
            var longitude = HttpContext.Current.Request.QueryString["Longitude"];

            return this.Search(searchText, latitude, longitude);
        }

        #region Implementation

        private SearchModel Search(string searchText, string latitude, string longitude)
        {
            var result = new SearchModel();
            var hardimans = new Establishment
                                {
                                    Address =
                                        new Address
                                            {
                                                AddressPk = Guid.NewGuid(),
                                                AddressType = "EST",
                                                Country = "Australia",
                                                Location = DbGeography.FromText(string.Format("POINT({0} {1})", longitude, latitude)),
                                                Number = "521",
                                                Postcode = "3031",
                                                State = "VIC",
                                                Street = "Macaulay",
                                                StreetType = "Rd",
                                                Suburb = "Kensington"
                                            },
                                    Name = "Hardimans",
                                    Description = "",
                                    MainImageUrl = ""

                                };
            result.Establishments = new[] { hardimans };
            result.SearchText = searchText;
            result.SearchLocation = latitude + "," + longitude;
            return result;
        }

        #endregion
    }
}