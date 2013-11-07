namespace wwDrink.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using wwDrink.data;
    using wwDrink.data.Models;

    public class AspectController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        // GET api/Aspect
        public IEnumerable<Aspect> GetAspects()
        {
            var aspects = db.Aspects.Include(a => a.Category);
            return aspects.AsEnumerable();
        }

        // GET api/Aspect/5
        public Aspect GetAspect(Guid id)
        {
            Aspect aspect = db.Aspects.Find(id);
            if (aspect == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return aspect;
        }

        // PUT api/Aspect/5
        public HttpResponseMessage PutAspect(Guid id, Aspect aspect)
        {
            if (ModelState.IsValid && id == aspect.AspectPk)
            {
                db.Entry(aspect).State = EntityState.Modified;

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

        // POST api/Aspect
        public HttpResponseMessage PostAspect(Aspect aspect)
        {
            if (ModelState.IsValid)
            {
                db.Aspects.Add(aspect);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, aspect);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = aspect.AspectPk }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        // DELETE api/Aspect/5
        public HttpResponseMessage DeleteAspect(Guid id)
        {
            Aspect aspect = db.Aspects.Find(id);
            if (aspect == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Aspects.Remove(aspect);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, aspect);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}