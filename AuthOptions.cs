using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace ShopWEB1
{
    public class AuthOptions
    {
        public string CookiesName { get; set; }
        public string ISSUER { get; set; }
        public string AUDIENCE { get; set; }
        public string KEY { get; set; }
        public int TokenLifeTime { get; set; } 
        public SymmetricSecurityKey GetSymmetricSecurityKey() =>
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
    }
}
