using System;

namespace wwDrink.Models
{
    public class Favorite
    {
        public Guid FavoritePk { get; set; }
        public Guid ItemFk { get; set; }
        public int Level { get; set; }
    }
}