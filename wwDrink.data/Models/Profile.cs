namespace wwDrink.data.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("UserProfile")]
    public class Profile
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string ScreenName { get; set; }
        public string AgeRange { get; set; }
    }
}