namespace wwDrink.Controllers
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Web;
    using System.Web.Http;

    using wwDrink.Models;
    using wwDrink.data;

    public class DrinksController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        [HttpGet]
        public DrinkSearchModel Drinks()
        {
            try
            {
                var searchText = HttpContext.Current.Request.QueryString["Query"];
                var type = HttpContext.Current.Request.QueryString["type"];
                var pageSize = int.Parse(HttpContext.Current.Request.QueryString["pageSize"]);

                var total = this.db.Drinks.Count(s => s.Type == type && s.Name.Contains(searchText));
                var page = int.Parse(HttpContext.Current.Request.QueryString["page"]);
                var pages = total / pageSize + ((total % pageSize != 0) ? 1 : 0);
                var drinks = db.Drinks.Include("Crafter").Where(s => s.Type == type && s.Name.Contains(searchText)).OrderBy(s => s.Name).Skip((page - 1) * pageSize).Take(pageSize).ToArray();
                var result = new DrinkSearchModel
                {
                    Drinks = drinks,
                    SearchText = searchText,
                    Pagination =
                        new Pagination
                        {
                            Results = total,
                            PageSize = pageSize,
                            Page = page,
                            Pages = pages
                        }
                };
                return result;
            }
            catch (Exception)
            {
                throw new HttpResponseException(HttpStatusCode.InternalServerError);
            }
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}
