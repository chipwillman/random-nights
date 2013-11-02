namespace wwDrink.Tests.Integration.Entity
{
    using System.Collections.ObjectModel;

    public class LoginResults
    {
        private ReadOnlyCollection<string> alternateLoginServices;

        public ReadOnlyCollection<string> AlternateLoginServices    
        {
            get
            {
                return this.alternateLoginServices;
            }
            set
            {
                this.alternateLoginServices = value;
            }
        }
    }
}
