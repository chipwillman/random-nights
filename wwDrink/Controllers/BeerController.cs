namespace wwDrink.Controllers
{
    using System.Linq;
    using System.Web.Mvc;

    using WebMatrix.WebData;

    using wwDrink.data;

    public class BeerController : Controller
    {
        private RandomNightsContext db = new RandomNightsContext();

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        public ActionResult Index()
        {
            if (WebSecurity.IsAuthenticated)
            {
                var profile = db.Profiles.First(p => p.UserId == WebSecurity.CurrentUserId);
                ViewBag.ScreenName = profile.ScreenName;
            }
            else
            {
                ViewBag.ScreenName = "";
            }
            return View();
        }
    }
}
