namespace wwDrink.Models
{
    using System.Collections.ObjectModel;

    public class ClientAspect
    {
        public string AgeRange { get; set; }
        public ReadOnlyCollection<Favorite> PubTypes { get; set; }
        public ReadOnlyCollection<Favorite> Activities { get; set; }
        public ReadOnlyCollection<Favorite> Games { get; set; }
        public ReadOnlyCollection<Favorite> MusicGenre { get; set; }
        public ReadOnlyCollection<Favorite> SexOrientation { get; set; }
        public ReadOnlyCollection<Favorite> FavoriteBeer { get; set; }
        public ReadOnlyCollection<Favorite> FavoriteWine { get; set; }
        public ReadOnlyCollection<Favorite> FavoriteMixed { get; set; }
        public ReadOnlyCollection<Favorite> DesiredAspects { get; set; } 
    }
}