namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("Reviews")]
    public class Review
    {
        [Key]
        public Guid ReviewPk { get; set; }

        public Guid UserFk { get; set; }

        [ForeignKey("UserFk")]
        [Required]
        public Profile Profile { get; set; }

        [Index("IDX_Parent", false)]
        [Required]
        public Guid ParentFk { get; set; }

        [MaxLength(32)]
        [Required]
        public string ParentTable { get; set; }

        [Column(TypeName = "ntext")]
        [MaxLength]
        [Required]
        public string ReviewText { get; set; }

        public decimal Rating { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ReviewDate { get; set; }
    }
}