namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("UserProfile")]
    public class Profile
    {
        [Index("IDX_UserId", true)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Key]
        public Guid UserPk { get; set; }
        [Index("IDX_UserName")]
        [MaxLength(100)]
        public string UserName { get; set; }
        [MaxLength(100)]
        public string ScreenName { get; set; }
        [MaxLength(20)]
        public string AgeRange { get; set; }
    }
}