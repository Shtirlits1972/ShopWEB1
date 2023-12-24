using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.IdentityModel.Tokens;
using ShopWEB1;
using ShopWEB1.Models;
using System.Globalization;
using ShopWEB1.Controllers;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<DataContext>();

AuthOptions auth = Ut.GetAuthOptions();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // укзывает, будет ли валидироваться издатель при валидации токена
        ValidateIssuer = true,
        // строка, представляющая издателя
        ValidIssuer = auth.ISSUER,

        // будет ли валидироваться потребитель токена
        ValidateAudience = true,
        // установка потребителя токена
        ValidAudience = auth.AUDIENCE,
        // будет ли валидироваться время существования
        ValidateLifetime = true,

        // установка ключа безопасности
        IssuerSigningKey = auth.GetSymmetricSecurityKey(),
        // валидация ключа безопасности
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddAuthorization();

// схема аутентификации - с помощью jwt-токенов
//builder.Services.AddAuthentication().AddJwtBearer(JwtBearerDefaults.AuthenticationScheme);


// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddCors();

var app = builder.Build();

//CultureInfo cultureInfo = new CultureInfo("ru-RU");
//CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
//CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

app.UseRequestLocalization();

app.Use(async (context, next) =>
{
    var token = context.Request.Cookies[auth.CookiesName];

    if (!string.IsNullOrEmpty(token))
    {
        context.Request.Headers.Add("Authorization", $"Bearer {token}");
    }

    await next.Invoke();
});

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();   // добавление middleware аутентификации 
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapDefaultControllerRoute();
});

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

//app.Map("/login/{username}", (string username) =>
//{
//    var claims = new List<Claim> { new Claim(ClaimTypes.Name, username) };
//    // создаем JWT-токен
//    var jwt = new JwtSecurityToken(
//            issuer: AuthOptions.ISSUER,
//            audience: AuthOptions.AUDIENCE,
//            claims: claims,
//            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
//            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

//    return new JwtSecurityTokenHandler().WriteToken(jwt);
//});

//app.Map("/data", [Authorize] () => new { message = "Hello World!" });

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{

};

app.UseSwagger();
app.UseSwaggerUI();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
};

app.UseHttpsRedirection();
//app.UseStaticFiles();

app.MapControllers();


CultureInfo cultureInfo = new CultureInfo("ru-RU");

CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

//app.UseRouting();

// подключаем CORS
app.UseCors(builder => builder.AllowAnyOrigin());
app.UseCors(builder => builder
                             .AllowCredentials()
                             .AllowAnyMethod()
                             .AllowAnyHeader()
                             .AllowAnyOrigin());

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();




