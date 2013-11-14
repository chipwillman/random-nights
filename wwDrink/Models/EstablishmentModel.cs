namespace wwDrink.Models
{
    using System;

    using System.Runtime.Serialization;

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
        [DataMember(Name = "address_street_number")]
        public string AddressStreetNumber { get; set; }
        [DataMember(Name = "address_street")]
        public string AddressStreet { get; set; }
        [DataMember(Name = "address_city")]
        public string AddressCity { get; set; }
        [DataMember(Name = "address_state")]
        public string AddressState { get; set; }
        [DataMember(Name = "address_country")]
        public string AddressCountry { get; set; }
        [DataMember(Name = "address_post_code")]
        public string AddressPostCode { get; set; }

        public string[] Features { get; set; }
        [DataMember(Name = "open_hours")]
        public string[] OpenHours { get; set; }

        [DataMember(Name = "photo_urls")]
        public string[] PhotosUrls { get; set; }

        public string Rating { get; set; }
    }
}