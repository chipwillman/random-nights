namespace wwDrink.Models
{
    using System.ComponentModel.DataAnnotations;

    public class SearchModel
    {
        public Pagination Pagination { get; set; }

        [Display(Name = "Search Criteria")]
        public string SearchText { get; set; }

        public Establishment[] Establishments { get; set; }

        [Display(Name = "Location")]
        public string SearchLocation { get; set; }
    }
}