namespace wwDrink.Models
{
    using wwDrink.data.Models;

    public class DrinkSearchModel
    {
        public Pagination Pagination { get; set; }

        public string SearchText { get; set; }

        public Drink[] Drinks { get; set; }
    }
}