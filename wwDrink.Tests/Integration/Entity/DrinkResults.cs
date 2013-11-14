namespace wwDrink.Tests.Integration.Entity
{
    public class Drink
    {
        public string Name { get; set; }
        public string Brewery { get; set; }
    }

    public class Review
    {
        public string ReviewText { get; set; }
        public string Author { get; set; }
        public string Date { get; set; }
    }

    public class DrinkResults
    {
        public Drink[] Drinks { get; set; }

        public Review[] Reviews { get; set; }

        public bool SearchButtonVisible { get; set; }

        public string Title { get; set; }
    }
}
