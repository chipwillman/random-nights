namespace wwDrink.Tests.Integration.StepDefinitions
{
    using System;
    using System.Configuration;
    using System.Data.Entity.Infrastructure;
    using System.Data.SqlClient;
    using System.Threading;

    using SimpleSecurity;

    using wwDrink.Models;
    using System.Data.Entity;

    public class DataSteps
    {
        public static void ConfirmUser(string userName)
        {
            var sqlText =
                "UPDATE webpages_Membership SET IsConfirmed = 1 WHERE webpages_Membership.UserId = (SELECT TOP 1 UserId FROM UserProfiles WHERE UserName = @UserName)";
            using (var connection = new SqlConnection(ConfigurationManager.AppSettings["DefaultConnectionString"]))
            {
                connection.Open();
                var command = new SqlCommand(sqlText, connection);
                command.Parameters.AddWithValue("@UserName", userName);
                command.ExecuteNonQuery();
            }
        }
    }
}
