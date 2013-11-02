namespace wwDrink.Models
{
    using System.Data.Entity;

    public class RandomNightsContext : DbContext
    {
        public RandomNightsContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<Aspect> Aspects { get; set; }

        public DbSet<Establishment> Establishments { get; set; }

        public DbSet<PreferenceCategory> Categories { get; set; }

        public DbSet<Profile> Profiles { get; set; }

        public DbSet<UserPreference> Preferences { get; set; }
    }
}