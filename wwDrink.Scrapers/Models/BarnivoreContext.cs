namespace wwDrink.Scrapers.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;

    public class BarnivoreContext : DbContext 
    {
        public BarnivoreContext()
            : base("DefaultConnection")
        {
        }

        public IDbSet<Brewery> Breweries { get; set; }
        public IDbSet<Drink> Drinks { get; set; } 
    }

    [Table("Brewery")]
    public class Brewery
    {
        [Key]
        public int Id { get; set; }
        public int BarnivoreId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
    }

    [Table("Drink")]
    public class Drink
    {
        [Key]
        public int Id { get; set; }
        public int BarnivoreId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int BreweryId { get; set; }
        public bool Vegan { get; set; }
    }
}
