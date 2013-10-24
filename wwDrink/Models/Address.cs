namespace wwDrink.Models
{
    using System;

    public class Address
    {
        public Guid AddressPK { get; set; }
        public string Description { get; set; }
        public string AddressType { get; set; }
        public string Suburb { get; set; }
        public string Postcode { get; set; }
        public string SubNumber { get; set; }
        public string Number { get; set; }
        public string Street { get; set; }
        public string StreetType { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public decimal? GpsLatitude { get; set; }
        public decimal? GpsLongitude { get; set; }
    }
}