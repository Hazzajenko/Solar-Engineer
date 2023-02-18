using Duende.IdentityServer.EntityFramework.Entities;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Authentication;

public static class AuthExtensions
{
    public static IServiceCollection InitAuth(
        this IServiceCollection services,
        IConfiguration config
    )
    {
 
        var authConfig = services.GetRequiredConfiguration<AuthOptions>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.Authority = "https://localhost:6006";
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters.ValidateAudience = false;
            });

        if (!string.IsNullOrEmpty(authConfig.Audience))
            services.AddAuthorization(options =>
                options.AddPolicy(nameof(ApiScope), policy =>
                {
                    policy.RequireAuthenticatedUser();
                    policy.RequireClaim("scope", authConfig.Audience);
                })
            );


        return services;
    }
}