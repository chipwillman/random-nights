using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace wwDrink.Controllers
{
    using System.Data.Entity;
    using System.Web.Mvc;
    using WebMatrix.WebData;

    using wwDrink.Filters;
    using wwDrink.data;
    using wwDrink.data.Models;

    [Authorize]
    [InitializeSimpleMembership]
    public class ProfileController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        // GET api/Profile
        public IEnumerable<Profile> GetProfiles()
        {
            var userId = WebSecurity.CurrentUserId;
            return db.Profiles.Where(u => u.UserId == userId).ToArray().AsEnumerable();
        }

        // GET api/Profile/5
        public Profile GetProfile(int id)
        {
            Profile profile = db.Profiles.Find(id);
            if (profile == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return profile;
        }

        // PUT api/Profile/5
        public HttpResponseMessage PutProfile(int id, Profile profile)
        {
            if (ModelState.IsValid && id == profile.UserId)
            {
                db.Entry(profile).State = EntityState.Modified;

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
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        // POST api/Profile
        public HttpResponseMessage PostProfile(Profile profile)
        {
            if (ModelState.IsValid)
            {
                profile.UserId = WebSecurity.CurrentUserId;
                db.Profiles.Add(profile);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, profile);
                var location = Url.Link("DefaultApi", new { id = profile.UserId });
                if (location != null)
                response.Headers.Location = new Uri(location);
                return response;
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        // DELETE api/Profile/5
        public HttpResponseMessage DeleteProfile(int id)
        {
            Profile profile = db.Profiles.Find(id);
            if (profile == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Profiles.Remove(profile);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, profile);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}