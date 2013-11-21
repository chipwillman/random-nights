using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace wwDrink.Controllers
{
    using Microsoft.Web.WebPages.OAuth;

    using WebMatrix.WebData;

    using wwDrink.Models;
    using wwDrink.data;

    public class HomeController : Controller
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
            ViewBag.Message = "Where and what to drink";
            if (WebSecurity.IsAuthenticated)
            {
                var profile = db.Profiles.First(p => p.UserId == WebSecurity.CurrentUserId);
                ViewBag.ScreenName = profile.ScreenName;
            }
            else
            {
                ViewBag.ScreenName = "";
            }
            return View(new SearchModel());
        }

        public ActionResult Search(SearchModel model)
        {
            model.SearchText = model.SearchText;

            return this.View(new SearchModel());
        }

        public ActionResult About()
        {
            ViewBag.Message = "We combine our reviews with partner sites to give you the best knowledge to plan where to go out for a good evening.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [AllowAnonymous]
        [ChildActionOnly]
        public ActionResult ExternalLoginsList(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return PartialView("_ExternalLoginsListPartial", OAuthWebSecurity.RegisteredClientData);
        }
    }
}
