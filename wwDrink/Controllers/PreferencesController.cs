using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using wwDrink.Models;

namespace wwDrink.Controllers
{
    using System.Web.Mvc;

    using WebMatrix.WebData;

    using wwDrink.Filters;

    [Authorize]
    [InitializeSimpleMembership]
    public class PreferencesController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        // GET api/Preferences
        public IEnumerable<UserPreference> GetUserPreferences()
        {
            var userId = WebSecurity.CurrentUserId;
            var preferences = db.Preferences.Include(u => u.Aspect);
            return preferences.Where(p => p.UserId == userId).AsEnumerable();
        }

        // GET api/Preferences/5
        public UserPreference GetUserPreference(Guid id)
        {
            UserPreference userpreference = db.Preferences.Find(id);
            if (userpreference == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return userpreference;
        }

        // PUT api/Preferences/5
        public HttpResponseMessage PutUserPreference(Guid id, UserPreference userpreference)
        {
            if (ModelState.IsValid && id == userpreference.UserPreferencePk)
            {
                userpreference.UserId = WebSecurity.CurrentUserId;
                db.Entry(userpreference).State = EntityState.Modified;

                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // POST api/Preferences
        public HttpResponseMessage PostUserPreference(UserPreference userpreference)
        {
            if (ModelState.IsValid)
            {
                userpreference.UserPreferencePk = Guid.NewGuid();
                userpreference.UserId = WebSecurity.CurrentUserId;
                db.Preferences.Add(userpreference);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, userpreference);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = userpreference.UserPreferencePk }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Preferences/5
        public HttpResponseMessage DeleteUserPreference(Guid id)
        {
            UserPreference userpreference = db.Preferences.Find(id);
            if (userpreference == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Preferences.Remove(userpreference);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, userpreference);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}