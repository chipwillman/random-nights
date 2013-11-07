namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Spatial;

    [Table("Crafter")]
    public class Crafter
    {
        [Key]
        public Guid CrafterPk { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public string Fax { get; set; }

        public string Email { get; set; }

        public string Url { get; set; }

        public string Description { get; set; }

        public DbGeography Location { get; set; }
    }
}