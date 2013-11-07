namespace wwDrink.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using WebMatrix.WebData;

    using wwDrink.Extensions;
    using wwDrink.data;
    using wwDrink.data.Models;

    public class UserController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        // GET api/Preferences
        public IEnumerable<UserPreference> GetUserPreferences()
        {
            var queryIdString = WebSecurity.CurrentUserId;
            return db.Preferences.AsEnumerable().Where(p => p.UserId == queryIdString);
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
            if (ModelState.IsValid && id == userpreference.UserPreferencePk && WebSecurity.CurrentUserId > 0)
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
        public HttpResponseMessage Post(UserPreference userpreference)
        {
            if (ModelState.IsValid && WebSecurity.CurrentUserId > 0)
            {
                userpreference.UserPreferencePk = Guid.NewGuid();
                userpreference.UserId = WebSecurity.CurrentUserId;
                db.Preferences.Add(userpreference);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, userpreference);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = userpreference.UserPreferencePk }));
                response.ReasonPhrase = userpreference.UserPreferencePk.ToString();
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
            if (userpreference == null || WebSecurity.CurrentUserId <= 0)
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