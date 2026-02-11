/*

using System.Text;
using backend.Data;
using backend.Middleware;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();


// CORS pre NextJS frontend
// https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-9.0
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "FrontendPolicy", policy =>
    {
        var allowedOrigins = builder.Configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>();

        policy.WithOrigins(allowedOrigins!)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MaturitnyProjekt")));

builder.Services.AddScoped<IQuestionsService, QuestionsService>();
builder.Services.AddScoped<ISubjectsService, SubjectsService>();
builder.Services.AddScoped<ITestsService, TestsService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();


builder.Services.AddAuthentication("Bearer")
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Method == HttpMethods.Options)
                return Task.CompletedTask;

            if (!context.Request.Cookies.ContainsKey("access_token"))
                return Task.CompletedTask;

            context.Token = context.Request.Cookies["access_token"];
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
        )
    };
});


builder.Services.AddAuthorization();

builder.Services.AddControllers();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("");
        
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-9.0#middleware-order



var forwardedOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                       ForwardedHeaders.XForwardedProto
};

forwardedOptions.KnownNetworks.Clear();
forwardedOptions.KnownProxies.Clear();

app.UseForwardedHeaders(forwardedOptions);

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("FrontendPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

*/

using System.Text;
using backend.Data;
using backend.Middleware;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// 1. NaËÌtanie a LOGOVANIE Origins (aby si videl v logoch na serveri, Ëi sa naËÌtali)
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
Console.WriteLine($"[CORS SETUP] Loading origins: {string.Join(", ", allowedOrigins)}");

// CORS nastavenie
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "FrontendPolicy", policy =>
    {
        // 2. Oöetrenie: TrimEnd('/') - prehliadaË posiela Origin bez lomky na konci, config ho tam mÙûe maù
        var normalizedOrigins = allowedOrigins.Select(o => o.Trim().TrimEnd('/')).ToArray();

        policy.WithOrigins(normalizedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("MaturitnyProjekt")));

// Services registr·cia...
builder.Services.AddScoped<IQuestionsService, QuestionsService>();
builder.Services.AddScoped<ISubjectsService, SubjectsService>();
builder.Services.AddScoped<ITestsService, TestsService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Auth nastavenie...
builder.Services.AddAuthentication("Bearer").AddJwtBearer(options =>
{
    // Tvoje nastavenia JWT...
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("access_token"))
            {
                context.Token = context.Request.Cookies["access_token"];
            }
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
        )
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

// Configuration for headers
// 3. Toto musÌ byù nakonfigurovanÈ hneÔ, ale pouûitÈ aû v app.Use...
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

// ---------------------------------------------------------
// MIDDLEWARE PIPELINE (Poradie je KRITICK…)
// ---------------------------------------------------------

// 4. Toto MUSÕ byù prvÈ, ak si za Nginx/Proxy. Inak .NET nevie, ûe beûÌ na HTTPS.
app.UseForwardedHeaders();

app.UseMiddleware<ExceptionMiddleware>();
app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("");
}

// Migr·cie
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 5. HttpsRedirection mÙûe robiù problÈmy ak proxy nerieöi SSL spr·vne,
// ale ak m·ö ForwardedHeaders spr·vne, malo by to byù OK.
// Ak ti to bude st·le blbn˙ù, sk˙s tento riadok zakomentovaù na test.
app.UseHttpsRedirection();

app.UseRouting();

// 6. CORS musÌ byù MEZI UseRouting a UseAuthentication
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();