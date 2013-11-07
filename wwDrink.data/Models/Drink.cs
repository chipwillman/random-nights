namespace wwDrink.data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Web.DynamicData;

    [TableName("Drink")]
    public class Drink
    {
        [Key]
        public Guid DrinkPk { get; set; }

        public Guid CrafterFk { get; set; }
        [ForeignKey("CrafterFk")]
        public Crafter Crafter { get; set; }

        public string Type { get; set; }

        public string Name { get; set; }

        public bool Vegan { get; set; }
    }
}