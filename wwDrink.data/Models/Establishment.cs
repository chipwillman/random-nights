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
        [Index("IDX_Establishment", false)]
        public Guid EstablishmentFk { get; set; }
        public string ImageUrl { get; set; }
        public Aspect Aspect { get; set; }
    }

    public class AspectEstablishmentLink
    {
        [Key]
        public Guid AspectEstablishmentLinkPk { get; set; }
        public Guid AspectFk { get; set; }
        [ForeignKey("AspectFk")]
        public Aspect Aspect { get; set; }
        [Index("IDX_Establishment", false)]
        public Guid EstablishmentFk { get; set; }
        public decimal Rating { get; set; }
    }

    [Table("Establishments")]
    public class Establishment
    {
        [Key]
        public Guid EstablishmentPk { get; set; }
        [MaxLength(100)]
        [Index("IDX_Name", false)]
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid AddressFk { get; set; }
        [ForeignKey("AddressFk")]
        public Address Address { get; set; }
        public string MainImageUrl { get; set; }
        public DbGeography Location { get; set; }
        [Index("IDX_GoogleId")]
        [MaxLength(100)]
        public string GoogleId { get; set; }
        [MaxLength(500)]
        public string GoogleReference { get; set; }
        public string OpenHours { get; set; }
        public decimal Rating { get; set; }
        public List<AspectEstablishmentLink> Aspects { get; set; }
        public List<EstablishmentImage> Images { get; set; } 
    }
}