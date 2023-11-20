namespace ShopWEB1
{
    public class Ut
    {
        private static readonly ConfigurationBuilder builder = (ConfigurationBuilder)new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json");
        private static IConfiguration Configuration = builder.Build();

        public static string GetConnetString()
        {
            return Configuration.GetConnectionString("SqlConnString")!;
        }

        public static AuthOptions GetAuthOptions()
        {
            AuthOptions authConf = new AuthOptions();
            Configuration.GetSection(nameof(AuthOptions)).Bind(authConf);



            return authConf;
        }

        public static int getCoociesLifetime()
        {
            //  c.UserName = _configuration.GetValue<string>("Credential:username");

            return 7;
        }

        public static string[] GetRoles()
        {
            return new[] { "user", "admin" };
        }
    }
}
