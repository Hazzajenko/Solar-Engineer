using Identity.Application.Settings;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Identity.Application.Extensions.ServiceCollection;

public static class OptionsExtensions
{
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
}