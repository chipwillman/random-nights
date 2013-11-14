namespace wwDrink.data
{
    using System.Data.Entity;

    using wwDrink.data.Models;

    public class RandomNightsContext : DbContext
    {
        public RandomNightsContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<Aspect> Aspects { get; set; }

        public DbSet<Establishment> Establishments { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<PreferenceCategory> Categories { get; set; }

        public DbSet<Profile> Profiles { get; set; }

        public DbSet<UserPreference> Preferences { get; set; }

        public DbSet<Crafter> Crafters { get; set; }

        public DbSet<Drink> Drinks { get; set; }
    }
}