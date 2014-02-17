namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Crafter")]
    public class Crafter
    {
        [Key]
        public Guid CrafterPk { get; set; }

        [Index("IDX_Name")]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(300)]
        public string Address { get; set; }

        [MaxLength(50)]
        public string Phone { get; set; }

        [MaxLength(50)]
        public string Fax { get; set; }

        [MaxLength(128)]
        public string Email { get; set; }

        public string Url { get; set; }

        public string Description { get; set; }

        public DbGeography Location { get; set; }
    }
}