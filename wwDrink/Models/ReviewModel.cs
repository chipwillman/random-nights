namespace wwDrink.Models
{
    using System;
    using System.Runtime.Serialization;

    [DataContract]
    public class ReviewModel
    {
        public Guid Pk { get; set; }

        public Guid UserFk { get; set; }

        public Guid ParentFk { get; set; }

        public string ParentTable { get; set; }

        public string ReviewText { get; set; }

        public decimal Rating { get; set; }
    }
}