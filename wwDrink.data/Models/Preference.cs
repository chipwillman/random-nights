namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("PreferenceCategory")]
    public class PreferenceCategory
    {
        [Key]
        public Guid PreferenceCategoryPk { get; set; }
        public string CategoryName { get; set; }
    }

    [Table("Aspect")]
    public class Aspect
    {
        [Key]
        public Guid AspectPk { get; set; }
        public string AspectName { get; set; }

        public Guid PreferenceCategoryPk { get; set; }
        [ForeignKey("PreferenceCategoryPk")]
        public PreferenceCategory Category { get; set; }
    }

    public class AspectModel
    {
        public Guid AspectPk { get; set; }
        public string AspectName { get; set; }
        public Guid PreferenceCategoryPk { get; set; }
    }

    public class UserPreferenceData
    {
        public Guid UserPreferencePk { get; set; }
        public string ScreenName { get; set; }
        public UserPreference[] Preferences { get; set; }
    }

    [Table("UserPreference")]
    public class UserPreference
    {
        [Key]
        public Guid UserPreferencePk { get; set; }

        public int UserId { get; set; }

        public Guid AspectFk { get; set; }
        [ForeignKey("AspectFk")]
        public virtual Aspect Aspect { get; set; }
        public bool Required { get; set; }
        public bool Excluded { get; set; }
        public Decimal? Factor { get; set; }
    }
}