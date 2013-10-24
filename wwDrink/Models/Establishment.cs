namespace wwDrink.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Establishment
    {
        [Display(Name = "Establishment Name")]
        public string Name { get; set; }
        public string Description { get; set; }
        public Address Address { get; set; }
        public string ImageUrl { get; set; }
    }
}