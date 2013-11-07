namespace wwDrink.data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Spatial;

    public class EstablishmentImage
    {
        [Key]
        public Guid EstablishmentImagePk { get; set; }
        public Guid EstablishmentFk { get; set; }
        public string ImageUrl { get; set; }
        public Aspect Aspect { get; set; }
    }

    public class AspectEstablishmentLink
    {
        [Key]
        public Guid AspectEstablishmentLinkPk { get; set; }
        public Guid AspectFk { get; set; }
        public Guid EstablishmentFk { get; set; }
    }

    [Table("Establishment")]
    public class Establishment
    {
        [Key]
        public Guid EstablishmentPk { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid AddressFk { get; set; }
        public Address Address { get; set; }
        public string MainImageUrl { get; set; }
        public DbGeography Location { get; set; }
        public List<AspectEstablishmentLink> Aspects { get; set; }
        public List<EstablishmentImage> Images { get; set; } 
    }
}