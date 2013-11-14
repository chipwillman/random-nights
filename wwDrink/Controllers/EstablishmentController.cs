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
    using System.Data.Spatial;

    using wwDrink.Models;

    public class EstablishmentController : ApiController
    {
        private RandomNightsContext db = new RandomNightsContext();

        // GET api/Establishment
        public IEnumerable<Establishment> GetEstablishments()
        {
            return db.Establishments.AsEnumerable();
        }

        // GET api/Establishment/5
        public Establishment GetEstablishment(string id)
        {
            Establishment establishment = null;
            Guid pk;
            if (Guid.TryParse(id, out pk))
            {
                establishment =
                    db.Establishments.Include(e => e.Address)
                      .Include(e => e.Aspects)
                      .Include(e => e.Images)
                      .FirstOrDefault(e => e.EstablishmentPk == pk);
            }

            if (establishment == null)
            {
                establishment =
                    db.Establishments.Include(e => e.Address)
                      .Include(e => e.Aspects)
                      .Include(e => e.Images)
                      .FirstOrDefault(e => e.GoogleId == id);
            }

            if (establishment == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return establishment;
        }

        // PUT api/Establishment/5
        public HttpResponseMessage PutEstablishment(Guid id, EstablishmentModel establishmentModel)
        {
            Establishment establishment = db.Establishments.First(e => e.EstablishmentPk == establishmentModel.PK);
            this.UpdateDbModel(establishment, establishmentModel);
            if (ModelState.IsValid && id == establishment.EstablishmentPk)
            {
                db.Entry(establishment).State = EntityState.Modified;

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

        // POST api/Establishment
        public HttpResponseMessage PostEstablishment(EstablishmentModel establishmentModel)
        {
            Establishment establishment = MapToDbModel(establishmentModel);
            if (ModelState.IsValid)
            {
                var existing = db.Establishments.FirstOrDefault(e => e.GoogleId == establishmentModel.GoogleId);
                if (existing != null)
                {
                    establishment = existing;
                }
                else
                {
                    db.Establishments.Add(establishment);
                    db.SaveChanges();
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, establishment);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = establishment.EstablishmentPk }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        private void UpdateDbModel(Establishment establishment, EstablishmentModel establishmentModel)
        {
            if (!string.IsNullOrEmpty(establishmentModel.Address))
            {
                establishment.Address = new Address
                {
                    AddressPk = Guid.NewGuid(),
                    AddressType = "Establishment",
                    Number = establishmentModel.AddressStreetNumber,
                    Street = establishmentModel.AddressStreet,
                    Country = establishmentModel.AddressCountry,
                    Suburb = establishmentModel.AddressCity,
                    Postcode = establishmentModel.AddressPostCode
                };
            }

            establishment.OpenHours = this.MapOpenHours(establishmentModel.OpenHours);
            establishment.Images = MapImages(establishmentModel.PhotosUrls, establishmentModel.PK);
            if (establishment.Images.Count > 0)
            {
                establishment.MainImageUrl = establishment.Images[0].ImageUrl;
            }
            establishment.Aspects = MapAspects(establishmentModel.Features, establishmentModel.PK);
        }

        private Establishment MapToDbModel(EstablishmentModel establishmentModel)
        {
            var rating = 1m;
            decimal.TryParse(establishmentModel.Rating, out rating);

            var result = new Establishment
                             {
                                 EstablishmentPk = establishmentModel.PK,
                                 Description = establishmentModel.Address,
                                 GoogleId = establishmentModel.GoogleId,
                                 GoogleReference = establishmentModel.GoogleReference,
                                 Location = DbGeography.FromText(string.Format("POINT({1} {0})", establishmentModel.Latitude, establishmentModel.Longitude)),
                                 Name = establishmentModel.Name,
                                 Rating = rating
                             };
            this.UpdateDbModel(result, establishmentModel);
            return result;
        }

        private string MapOpenHours(string[] hours)
        {
            var result = string.Empty;
            if (hours != null)
            {
                foreach (var hour in hours)
                {
                    result += hour + "|";
                }
            }
            return result;
        }

        private List<AspectEstablishmentLink> MapAspects(IEnumerable<string> features, Guid establishmentPk)
        {
            var result = new List<AspectEstablishmentLink>();
            if (features != null)
            {
                foreach (var feature in features)
                {
                    Aspect aspect = MapFeatureToAspect(feature);
                    if (aspect != null)
                    {
                        var link = new AspectEstablishmentLink
                                       {
                                           AspectEstablishmentLinkPk = Guid.NewGuid(),
                                           AspectFk = aspect.AspectPk,
                                           EstablishmentFk = establishmentPk
                                       };
                        result.Add(link);
                    }
                }
            }

            return result;
        }

        private Aspect MapFeatureToAspect(string feature)
        {
            var result = db.Aspects.FirstOrDefault(a => a.AspectName == feature);
            return result;
        }

        private List<EstablishmentImage> MapImages(IEnumerable<string> photosUrls, Guid establishmentModelPk)
        {
            var result = new List<EstablishmentImage>();
            if (photosUrls != null)
            {
                foreach (var photoUrl in photosUrls)
                {
                    result.Add(
                        new EstablishmentImage
                            {
                                EstablishmentImagePk = Guid.NewGuid(),
                                EstablishmentFk = establishmentModelPk,
                                ImageUrl = photoUrl
                            });
                }
            }
            return result;
        }

        // DELETE api/Establishment/5
        public HttpResponseMessage DeleteEstablishment(Guid id)
        {
            Establishment establishment = db.Establishments.Find(id);
            if (establishment == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Establishments.Remove(establishment);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, establishment);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}