﻿using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Web;

public static class CorsConfig
{
    public static IServiceCollection InitCors(
        this IServiceCollection services,
        string corsPolicy
    )
    {
        services.AddCors(options =>
        {
            options.AddPolicy(
                corsPolicy,
                policy =>
                    policy
                        .WithOrigins(
                            "http://localhost:5001",
                            "http://127.0.0.1:5001",
                            "https://localhost:6001",
                            "https://127.0.0.1:6001",
                            "http://localhost:4200",
                            "http://127.0.0.1:4200",
                            "https://localhost:4200",
                            "https://127.0.0.1:4200"
                        )
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
            );
        });

        return services;
    }
}