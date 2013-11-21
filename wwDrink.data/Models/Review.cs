namespace wwDrink.data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class ReviewAspectLink
    {
        [Key]
        public Guid ReviewAspectPk { get; set; }

        [Index("IDX_Review", false)]
        public Guid ReviewFk { get; set;}

        public Guid AspectFk { get; set; }

        [ForeignKey("AspectFk")]
        public Aspect Aspect { get; set; }

        public decimal Rating { get; set; }
    }

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

        public List<ReviewAspectLink> Aspects { get; set; }
    }
}