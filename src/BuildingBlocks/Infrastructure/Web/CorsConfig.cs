﻿using Microsoft.Extensions.DependencyInjection;

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
                            "https://localhost:7222",
                            "https://localhost:6006",
                            "https://localhost:6005",
                            "https://localhost:6004",
                            "https://localhost:6003",
                            "http://localhost:5045",
                            "http://localhost:5001",
                            "http://127.0.0.1:5001",
                            "https://localhost:6001",
                            "https://127.0.0.1:6001",
                            "http://localhost:4200",
                            "http://127.0.0.1:4200",
                            "https://localhost:4200",
                            // "https://localhost:4200/identity/login",
                            // "https://localhost:4200/identity/login/google",
                            "https://127.0.0.1:4200",
                            "https://solarengineer.net",
                            "https://solarengineer.net/auth-api"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
            );
        });

        return services;
    }
}