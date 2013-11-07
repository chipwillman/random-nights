using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace wwDrink
{
    using System.Collections.ObjectModel;
    using System.Data.Entity.Infrastructure;
    using System.Web.Caching;

    using WebMatrix.WebData;

    using wwDrink.data;
    using wwDrink.data.Models;

    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public ReadOnlyCollection<Aspect> Aspects
        {
            get
            {
                var aspects = this.Context.Cache.Get("Aspects") as List<Aspect>;
                if (aspects == null)
                {
                    using (var db = new RandomNightsContext())
                    {
                        aspects = db.Aspects.ToList();
                        this.Context.Cache.Add("Aspects", aspects, null, DateTime.Now.AddHours(1), TimeSpan.Zero, CacheItemPriority.Normal, null);
                    }
                }
                return new ReadOnlyCollection<Aspect>(aspects);
            }
        }

        public ReadOnlyCollection<PreferenceCategory> PreferenceCategories
        {
            get
            {
                var categories = this.Context.Cache.Get("PreferenceCategories") as List<PreferenceCategory>;
                if (categories == null)
                {
                    using (var db = new RandomNightsContext())
                    {
                        categories = db.Categories.ToList();
                        this.Context.Cache.Add("PreferenceCategories", categories, null, DateTime.Now.AddHours(1), TimeSpan.Zero, CacheItemPriority.Normal, null);
                    }
                }
                return new ReadOnlyCollection<PreferenceCategory>(categories);
            }
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            AuthConfig.RegisterAuth();

            try
            {
                using (var context = new RandomNightsContext())
                {
                    System.Data.Entity.Database.SetInitializer(new RandomNightsContextInitializer());
                    context.Database.Initialize(false);
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("User Perferences could not be initialized.", ex);
            }
        }
    }
}