namespace wwDrink.Controllers
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Spatial;
    using System.Linq;
    using System.Web;
    using System.Web.Http;

    using wwDrink.Models;
    using wwDrink.data;

    public class SearchController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();
        [HttpGet]
        public SearchModel Index()
        {
            var searchText = HttpContext.Current.Request.QueryString["Query"];
            var latitude = HttpContext.Current.Request.QueryString["Latitude"];
            var longitude = HttpContext.Current.Request.QueryString["Longitude"];
            double range;
            var rangeQueryString = HttpContext.Current.Request.QueryString["Range"];
            double.TryParse(rangeQueryString, out range);

            return this.Search(searchText, latitude, longitude, range);
        }

        #region Implementation

        private SearchModel Search(string searchText, string latitude, string longitude, double range)
        {
            var pageSize = 50;
            var result = new SearchModel();
            if (latitude != null && longitude != null && range < 500000)
            {
                var searchLocation = DbGeography.FromText(string.Format("POINT({1} {0})", latitude, longitude));

                var establishments = (from e in db.Establishments
                                      where e.Location.Distance(searchLocation) < range
                                      orderby e.Rating, e.Location.Distance(searchLocation)
                                      select e).Include(e => e.Images).Skip(0).Take(pageSize);
                result.Establishments = establishments.ToArray();
                result.SearchText = searchText;
                result.SearchLocation = latitude + "," + longitude;
                return result;
            }
            return result;
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        #endregion
    }
}