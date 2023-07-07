using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Web;

public static class CorsConfig
{
    public const string CorsPolicy = "CorsPolicy";

    public static IServiceCollection InitCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                CorsPolicy,
                policy =>
                    policy
                        .WithOrigins(
                            "https://localhost:4200",
                            "https://127.0.0.1:4200",
                            "https://solarengineer.net",
                            "https://solarengineer.app"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
            );
        });

        return services;
    }
}
