using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Users.API.Extensions;

public static class AuthExtensions
{
    public static IServiceCollection InitIdentityAuthUsers(this IServiceCollection services,
        IConfiguration config)
    {
        /*services.AddDataProtection()
            .PersistKeysToStackExchangeRedis(ConnectionMultiplexer.Connect("localhost"))
            .SetApplicationName("solarEngineer");*/
        /*ClientId = "client",
        ClientSecret = "secret",
        Scope = $"{Constants.StandardScopes.UsersApi}"*/
        /*services.AddAuthentication("Bearer")
            .AddJwtBearer(options =>
            {
                options.Authority = "https://localhost:6006";
                options.TokenValidationParameters.ValidateAudience = false;
                
                    
                options.TokenValidationParameters.ValidTypes = new[] { "at+jwt" };
                // options.
            });*/

        services.AddAuthentication(x =>
        {
            x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(x =>
        {
            x.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = config["Jwt:Issuer"],
                ValidAudience = config["Jwt:Audience"],
                ValidateIssuer = true,
                ValidateAudience = true
            };
        });

        /*services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddJwtBearer("bearer", x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudience = config["Jwt:Audience"],
                    ValidateIssuer = true,
                    ValidateAudience = true
                };
            });;*/
        /*services.AddAuthentication(options =>
            {
                /*options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;#1#
                options.DefaultScheme = "idsrv.external";
                options.DefaultSignInScheme = "idsrv.external";
                options.DefaultChallengeScheme = "idsrv.external";
            })
            /*.AddCookie( options =>
            {
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
                // options.LoginPath = "/Auth/Login";
                // options.AccessDeniedPath = "/Auth/AccessDenied";
                options.SlidingExpiration = true;
            })#1#.AddOpenIdConnect("idsrv.external", "Sign-in with Google", options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                options.ForwardSignOut = IdentityServerConstants.DefaultCookieAuthenticationScheme;

                options.Authority = "https://accounts.google.com/";
                options.ClientId = config["Google:ClientId"] ??
                                   throw new ArgumentNullException(nameof(options.ClientId));
            });*/
        /*.AddOpenIdConnect("oidc", opt =>
    {
        opt.Authority = "https://localhost:6006";
        opt.ClientId = "m2m.client";
        // opt.ClientId = "interactive";
        // opt.ClientId = "client";
        opt.ClientSecret = "secret";
        opt.ResponseType = "code";
    });*/
        /*services.AddAuthentication(opt =>
            {
                opt.DefaultScheme = "cookie";
                opt.DefaultChallengeScheme = "oidc";
            })
            .AddCookie("cookie")
            .AddOpenIdConnect("oidc", opt =>
            {
                opt.Authority = "https://localhost:6006";
                opt.ClientId = "m2m.client";
                // opt.ClientId = "interactive";
                // opt.ClientId = "client";
                opt.ClientSecret = "secret";
                opt.ResponseType = "code";
                opt.Scope.Add(Constants.StandardScopes.UsersApi);
                opt.UsePkce = true;
                opt.ResponseMode = "query";
                opt.SaveTokens = true;
            });*/
        // services.AddAuthorization();
        services.AddAuthorization(options =>
        {
            /*options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scope", "users-api");
            });*/
        });
        /*services.AddAuthentication(options =>
            {
                options.DefaultScheme = "Cookies";
                options.DefaultChallengeScheme = "oidc";
            }).AddCookie("Cookies")

           .AddOpenIdConnect("oidc", "Demo IdentityServer", options =>
            {
                options.Authority = "https://localhost:6006";

                options.ClientId = "web";
                options.ClientSecret = "secret";
                options.ResponseType = "code";

                options.SaveTokens = true;

                options.Scope.Clear();
                options.Scope.Add("openid");
                options.Scope.Add("profile");
                options.Scope.Add("offline_access");
                options.Scope.Add(Constants.StandardScopes.UsersApi);

                options.GetClaimsFromUserInfoEndpoint = true;
            });*/


// var authConfig = builder.Services.GetRequiredConfiguration<AuthOptions>();
        /*services.AddAuthorization(options =>
        {
            /*opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("User"));#1#
            /*options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scope", "users-api");
            });#1#
        });*/

        // if (env.IsDevelopment()) identityServerBuilder.AddDeveloperSigningCredential();

        return services;
    }
}