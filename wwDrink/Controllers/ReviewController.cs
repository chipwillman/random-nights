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
using wwDrink.data.Models;
using wwDrink.data;

namespace wwDrink.Controllers
{
    using System.Data.Entity.Validation;
    using System.Diagnostics;

    using WebMatrix.WebData;

    using wwDrink.Models;

    public class ReviewController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        // GET api/Review
        public IEnumerable<Review> GetReviews()
        {
            IEnumerable<Review> reviews;
                var parentQueryString = HttpContext.Current.Request.QueryString["Parent"];
            Guid parent;
            if (Guid.TryParse(parentQueryString, out parent))
            {
                reviews = db.Reviews.Where(r => r.ParentFk == parent).Include(r => r.Profile);
            }
            else
            {
                reviews = new Review[0];
            }

            return reviews.AsEnumerable();
        }

        // GET api/Review/5
        public Review GetReview(Guid id)
        {
            Review review = db.Reviews.Find(id);
            if (review == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return review;
        }

        // PUT api/Review/5
        public HttpResponseMessage PutReview(Guid id, Review review)
        {
            if (ModelState.IsValid && id == review.ReviewPk)
            {
                db.Entry(review).State = EntityState.Modified;

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

        // POST api/Review
        public HttpResponseMessage PostReview(ReviewModel reviewModel)
        {
            Review review = MapReview(reviewModel);
            if (ModelState.IsValid)
            {
                db.Reviews.Add(review);
                try
                {
                    db.SaveChanges();
                }
                catch (DbEntityValidationException dbEx)
                {
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            Trace.TraceInformation("Property: {0} Error: {1}", validationError.PropertyName, validationError.ErrorMessage);
                        }
                    }
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, review);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = review.ReviewPk }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        private Review MapReview(ReviewModel review)
        {
            var result = new Review();
            var profile = db.Profiles.FirstOrDefault(u => u.UserId == WebSecurity.CurrentUserId);
            if (profile != null)
            {
                result.UserFk = profile.UserPk;
                result.Profile = profile;
                result.ReviewText = review.ReviewText;
                result.ParentTable = review.ParentTable;
                result.ParentFk = review.ParentFk;
                result.Rating = review.Rating;
                result.ReviewPk = Guid.NewGuid();
                result.ReviewDate = DateTime.UtcNow;
                result.CreatedDate = DateTime.UtcNow;
            }
            return result;
        }

        // DELETE api/Review/5
        public HttpResponseMessage DeleteReview(Guid id)
        {
            Review review = db.Reviews.Find(id);
            if (review == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Reviews.Remove(review);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, review);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}