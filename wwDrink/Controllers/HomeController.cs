using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace wwDrink.Controllers
{
    using wwDrink.Models;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Where and what to drink";

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
    }
}
