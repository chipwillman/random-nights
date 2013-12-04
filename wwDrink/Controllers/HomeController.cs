using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace wwDrink.Controllers
{
    using System.Reflection;

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
            try
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
            }
            catch (TargetInvocationException)
            {
                ViewBag.ScreenName = "";
            }
            catch (ArgumentNullException)
            {
                ViewBag.ScreenName = "";
            }

            try
            {
                if (!string.IsNullOrEmpty(Request.QueryString["Establishment"]))
                {
                    Guid establishmentPk;
                    if (Guid.TryParse(Request.QueryString["Establishment"], out establishmentPk))
                    {
                        ViewBag.Establishment = establishmentPk.ToString();
                    }
                }

                if (!string.IsNullOrEmpty(Request.QueryString["Review"]))
                {
                    Guid reviewPk;
                    if (Guid.TryParse(Request.QueryString["Review"], out reviewPk))
                    {
                        ViewBag.Review = reviewPk.ToString();
                        var review = db.Reviews.Find(reviewPk);
                        ViewBag.Establishment = review.ParentFk;
                    }
                }
            }
            catch (NullReferenceException)
            {
            }

            return View(new SearchModel());
        }

        public ActionResult Review(string id)
        {
            Guid detailsPk;
            if (Guid.TryParse(id, out detailsPk))
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

                var review = db.Reviews.Find(detailsPk);
                if (review != null)
                {
                    ViewBag.Establishment = review.ParentFk.ToString();
                    ViewBag.Review = detailsPk.ToString();
                }
            }
            return View("Index", new SearchModel());
        }

        public ActionResult Show(string id)
        {
            Guid detailsPk;
            if (Guid.TryParse(id, out detailsPk))
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

                var establishment = db.Establishments.Find(detailsPk);
                if (establishment != null)
                {
                    ViewBag.Establishment = detailsPk.ToString();
                }
            }
            return View("Index", new SearchModel());
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
