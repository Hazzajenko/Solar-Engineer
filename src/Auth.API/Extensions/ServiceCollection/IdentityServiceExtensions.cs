using Auth.API.Data;
using Auth.API.Domain;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Extensions.ServiceCollection;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        /*
        services.AddIdentity<AppUser, AppRole>(options =>
        {
            options
        })
        */

        services
            .AddIdentityCore<AppUser>(opt => { opt.Password.RequireNonAlphanumeric = false; })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<AuthContext>();

        /*var domain = $"https://{config["Auth0:Domain"]}/";
        services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = domain;
                options.Audience = config["Auth0:Audience"];
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
        });

        services.AddSingleton<IAuthorizationHandler, HasScopeHandler>();*/

        return services;
    }
}