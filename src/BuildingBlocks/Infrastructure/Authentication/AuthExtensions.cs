using System.Text;
using Duende.IdentityServer.EntityFramework.Entities;
using Infrastructure.Azure;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication;

public static class AuthExtensions
{
    public static IServiceCollection ConfigureJwtAuthentication(this IServiceCollection services,
        IConfiguration config, JwtSettings jwtSettings)
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
                    Encoding.UTF8.GetBytes(jwtSettings.Key)
                ),
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
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

        // services.AddAuthorization();

        return services;
    }

    public static async Task<JwtSettings> GetJwtSettings(this ConfigurationManager config,
        IWebHostEnvironment environment)
    {
        if (environment.IsDevelopment())
            return config.GetSection("Jwt").Get<JwtSettings>() ?? throw new ArgumentNullException(nameof(JwtSettings));

        var jwtKey = await environment.GetJwtKey(config);
        return new JwtSettings
        {
            Key = jwtKey,
            Issuer = "https://solarengineer.app",
            Audience = "https://api.solarengineer.app"
        };
    }

    public static async Task<string> GetJwtKey(this IWebHostEnvironment environment,
        IConfiguration config)
    {
        var jwtKey = environment.IsDevelopment()
            ? config["Jwt:Key"]
            : await AzureSecrets.GetJwtKey();

        ArgumentNullException.ThrowIfNull(jwtKey);

        return jwtKey;
    }

    public static async Task<SymmetricSecurityKey> GetSymmetricSecurityKey(this IWebHostEnvironment environment,
        IConfiguration config)
    {
        var jwtKey = environment.IsDevelopment()
            ? config["Jwt:Key"]
            : await AzureSecrets.GetJwtKey();

        ArgumentNullException.ThrowIfNull(jwtKey);

        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    }

    public static IServiceCollection InitIdentityAuth(
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