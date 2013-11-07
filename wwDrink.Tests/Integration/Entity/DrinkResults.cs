namespace wwDrink.Tests.Integration.Entity
{
    public class Drink
    {
        public string Name { get; set; }
        public string Brewery { get; set; }
    }

    public class DrinkResults
    {
        public Drink[] Drinks { get; set; }

        public bool SearchButtonVisible { get; set; }

        public string Title { get; set; }
    }
}
