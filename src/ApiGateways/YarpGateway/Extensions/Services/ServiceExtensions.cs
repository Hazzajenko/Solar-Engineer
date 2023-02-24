using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace YarpGateway.Extensions.Services;

public static class ServiceExtensions
{
    public static IServiceCollection InitServiceCollection(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.InitIdentityAuthUsers(config);
        services.AddReverseProxy().LoadFromConfig(config.GetSection("ReverseProxy"));

        return services;
    }

    public static IServiceCollection InitIdentityAuthUsers(this IServiceCollection services,
        IConfiguration config)
    {
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


            x.Events = new JwtBearerEvents
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

        services.AddAuthorization(options =>
        {
            /*options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scope", "users-api");
            });*/
        });


        return services;
    }
}