using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Web;

public static class CorsConfig
{
    public static IServiceCollection InitCors(this IServiceCollection services, string corsPolicy)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                corsPolicy,
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
