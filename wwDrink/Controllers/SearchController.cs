namespace wwDrink.Controllers
{
    using System.Data.Entity;
    using System.Data.Spatial;
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

            return this.Search(searchText, latitude, longitude);
        }

        #region Implementation

        private SearchModel Search(string searchText, string latitude, string longitude)
        {
            var pageSize = 40;
            var result = new SearchModel();
            if (latitude != null && longitude != null)
            {
                var searchLocation = DbGeography.FromText(string.Format("POINT({1} {0})", latitude, longitude));

                var establishments = (from e in db.Establishments
                                      where e.Location.Distance(searchLocation) < 5000
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