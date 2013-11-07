namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Spatial;

    [Table("Address")]
    public class Address
    {
        [Key]
        public Guid AddressPk { get; set; }
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
        public DbGeography Location { get; set; }
    }
}