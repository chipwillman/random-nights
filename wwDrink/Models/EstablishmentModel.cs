namespace wwDrink.Models
{
    using System;

    using System.Runtime.Serialization;

    public class EstablishmentImageModel
    {
        public Guid EstablishmentFk { get; set; }
        [DataMember(Name = "imageUrl")]
        public string ImageUrl { get; set; }
        public Guid EstablishmentImagePk { get; set; }
        public string Aspect { get; set; }
    }

    public class EstablishmentModel
    {
        public Guid PK { get; set; }
        [DataMember(Name = "details_requested")]
        public bool DetailsRequested { get; set; }
        public bool Source { get; set; }
        public string Name { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Suburb { get; set; }
        public string Open { get; set; }
        [DataMember(Name = "google_id")]
        public string GoogleId { get; set; }
        [DataMember(Name = "google_reference")]
        public string GoogleReference { get; set; }

        public string Address { get; set; }
        [DataMember(Name = "addressStreetNumber")]
        public string AddressStreetNumber { get; set; }
        [DataMember(Name = "addressStreet")]
        public string AddressStreet { get; set; }
        [DataMember(Name = "addressCity")]
        public string AddressCity { get; set; }
        [DataMember(Name = "addressState")]
        public string AddressState { get; set; }
        [DataMember(Name = "addressCountry")]
        public string AddressCountry { get; set; }
        [DataMember(Name = "addressPostCode")]
        public string AddressPostCode { get; set; }

        public string[] Features { get; set; }
        [DataMember(Name = "open_hours")]
        public string[] OpenHours { get; set; }

        [DataMember(Name = "photosUrls")]
        public EstablishmentImageModel[] PhotosUrls { get; set; }

        public string Rating { get; set; }
    }
}