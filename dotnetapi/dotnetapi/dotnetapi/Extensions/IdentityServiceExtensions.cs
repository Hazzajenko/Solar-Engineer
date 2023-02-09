using System.Security.Claims;
using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddIdentityCore<AppUser>(opt => { opt.Password.RequireNonAlphanumeric = false; })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<DataContext>() /*.AddEntityFrameworkStores<InMemoryDatabase>()*/
            ;

        // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        var domain = $"https://{config["Auth0:Domain"]}/";
        // var domain = config.GetValue<string>("Auth0:Domain");
        services
            // .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddAuthentication(options =>
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
                options.Authority = domain;
                options.Audience = config["Auth0:Audience"];
                // o.Authority = config.GetValue<string>("Auth0:Domain");
                // o.Audience = config.GetValue<string>("Auth0:Audience");
                // o.Authority = $"https://{config["Auth0:Domain"]}/";
                // o.Audience = config["Auth0:Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    NameClaimType = ClaimTypes.NameIdentifier
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                            context.Token = accessToken;

                        return Task.CompletedTask;
                    }
                };
            });
        /*services
            .AddAuth0WebAppAuthentication(options =>
            {
                options.Domain = config["Auth0Settings:Domain"]!;
                options.ClientId = config["Auth0Settings:ClientId"]!;
                options.ClientSecret = config["Auth0Settings:ClientSecret"]!;
            })
            .WithAccessToken(options =>
            {
                options.Audience = config["Auth0Settings:Audience"]!;
                options.UseRefreshTokens = true;
            });*/
        ;
        /*.AddJwtBearer(options =>
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
        });*/


        services.AddAuthorization(opt =>
        {
            opt.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            opt.AddPolicy("BeAuthenticated", policy => policy.RequireRole("User"));
            opt.AddPolicy(
                "read:messages",
                policy => policy.Requirements.Add(new HasScopeRequirement("read:messages", domain!))
            );
            opt.AddPolicy(
                "read:current_user",
                policy =>
                    policy.Requirements.Add(new HasScopeRequirement("read:current_user", domain!))
            );
            // read:current_user
        });

        services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();

        return services;
    }
}