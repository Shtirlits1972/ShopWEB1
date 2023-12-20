using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ShopWEB1.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Policy;

namespace ShopWEB1.Controllers
{
    /// <summary>
    /// Контроллер для авторизации и регистрации
    /// </summary>

    //[ApiController]
    public class AccountController : Controller
    {
        private readonly DataContext _context;
        AuthOptions auth = Ut.GetAuthOptions();
        public AccountController(DataContext context)
        {
            _context = context;
        }

        /// возвращаем форму
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// Авторизация с помощью JWT
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(LoginModel model)
        {
            string token = LoginOut(model);
            if (String.IsNullOrEmpty(token))
            {
                ModelState.AddModelError("Error", "Некорректные логин и(или) пароль");
            }
            else
            {
                HttpContext.Response.Cookies.Append(auth.CookiesName, token, new CookieOptions { MaxAge = TimeSpan.FromDays(auth.TokenLifeTime), HttpOnly = true });
                return RedirectToAction("Index", "Home");
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterModel model)
        {
            if (ModelState.IsValid && model != null)
            {
                Users users = new Users { Email = model.Email, isAppruved = true, Role = "user", Password = model.Password, UsersName = model.UsersName, id = 0 };
                _context.Users.Add(users);
                await _context.SaveChangesAsync();
                LoginModel login = new LoginModel { Email = model.Email, Password = model.Password };
                string token = LoginOut(login);

                HttpContext.Response.Cookies.Append(auth.CookiesName, token, new CookieOptions { MaxAge = TimeSpan.FromDays(auth.TokenLifeTime), HttpOnly = true });
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ModelState.AddModelError("Error", "Ошибка регистрации");
            }
            return View(model);
        }

        [Route("api/[controller]/RegisterOutside")]
        [HttpPost]
        public async Task<IActionResult> RegisterOutside(RegisterModel model)
        {
            string token = string.Empty;

            if (ModelState.IsValid && model != null)
            {
                Users users = new Users { Email = model.Email, isAppruved = true, Role = "user", Password = model.Password, UsersName = model.UsersName, id = 0 };
                _context.Users.Add(users);
                await _context.SaveChangesAsync();
                LoginModel login = new LoginModel { Email = model.Email, Password = model.Password };
                token = LoginOut(login);

                HttpContext.Response.Cookies.Append(auth.CookiesName, token, new CookieOptions { MaxAge = TimeSpan.FromDays(auth.TokenLifeTime), HttpOnly = true });
                return Ok(token);
            }
            else
            {
                return StatusCode(500, "Ошибка регистрации");
            }

        }


        [Route("api/[controller]/LoginOutside")]
        [HttpPost]
        public IActionResult LoginOutside(LoginModel model)
        {
            string token = LoginOut(model);
            if (String.IsNullOrEmpty(token))
            {
                return StatusCode(403, "Ошибка авторизации");
            }
            else
            {
                HttpContext.Response.Cookies.Append(auth.CookiesName, token, new CookieOptions { MaxAge = TimeSpan.FromDays(auth.TokenLifeTime), HttpOnly = true });
                return Ok(token);
            }
        }


        [Route("api/[controller]/LoginOut")]
        [HttpPost]
        public string LoginOut(LoginModel model)
        {
            string token = string.Empty;

            if (ModelState.IsValid && model != null)
            {
                Users user = _context.Users.Where(x => x.Email == model.Email && x.Password == model.Password && x.isAppruved == true).FirstOrDefault(); //  UsersCrud.Login(model.Email, model.Password);

                if (user != null)
                {
                    List<Claim> claims = new List<Claim> {
                        new Claim(ClaimTypes.Name, user.UsersName),
                        new Claim(ClaimTypes.Role, user.Role),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim("Id", user.id.ToString())

                    };
                    // создаем JWT-токен
                    var jwt = new JwtSecurityToken(
                            issuer: auth.ISSUER,
                            audience: auth.AUDIENCE,
                            claims: claims,
                            expires: DateTime.UtcNow.Add(TimeSpan.FromDays(1)),
                            signingCredentials: new SigningCredentials(auth.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

                    token = new JwtSecurityTokenHandler().WriteToken(jwt);
                }
            }

            return token;
        }

        public IActionResult Logout()
        {
            HttpContext.Response.Cookies.Delete(auth.CookiesName);
            return RedirectToAction("Login", "Account");
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult LogOff()
        {
            HttpContext.Response.Cookies.Delete(auth.CookiesName);
            return RedirectToAction("Index", "Home");
        }
    }
}
