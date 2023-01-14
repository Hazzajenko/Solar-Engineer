using System.Text;
using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services,
        IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt => { opt.Password.RequireNonAlphanumeric = false; })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<DataContext>() /*.AddEntityFrameworkStores<InMemoryDatabase>()*/;


        // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        services.AddAuthentication(options =>
            {
                // Identity made Cookie authentication the default.
                // However, we want JWT Bearer Auth to be the default.
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            /*.AddGoogle(opts =>
            {
                opts.ClientId = config["Authentication:Google:ClientId"] ?? string.Empty;
                opts.ClientSecret = config["Authentication:Google:ClientSecret"] ?? string.Empty;
                // opts.ClientId = "717469225962-3vk00r8tglnbts1cgc4j1afqb358o8nj.apps.googleusercontent.com";
                // opts.ClientSecret = "babQzWPLGwfOQVi0EYR-7Fbb";
                opts.SignInScheme = IdentityConstants.ExternalScheme;
            })*/
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"] ?? string.Empty)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs"))
                            context.Token = accessToken;

                        return Task.CompletedTask;
                    }
                };
            });


        services.AddAuthorization(opt =>
        {
            opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("Admin", "User"));
        });

        return services;
    }
}