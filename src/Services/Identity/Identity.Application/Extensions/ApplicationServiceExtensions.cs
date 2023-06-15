using Identity.Application.Data.UnitOfWork;
using Identity.Application.Repositories.AppUsers;
using Identity.Application.Repositories.Notifications;
using Identity.Application.Services.Connections;
using Identity.Application.Services.DockerHub;
using Identity.Application.Services.Jwt;
using Identity.Application.Settings;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Identity.Application.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment environment,
        JwtSettings jwtSettings
    )
    {
        services.AddSingleton<ConnectionsService>();
        services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();
        services.AddScoped<IAppUsersRepository, AppUsersRepository>();
        services.AddScoped<INotificationsRepository, NotificationsRepository>();
        services.AddScoped<IDockerHubService, DockerHubService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        // services.AddScoped<IImagesService, ImagesService>();

        if (environment.IsDevelopment())
        {
            services.Configure<DockerHubSettings>(config.GetSection("DockerHub"));
            services.Configure<StorageSettings>(config.GetSection("Azure:Storage"));
        }
        else
        {
            services.Configure<DockerHubSettings>(settings =>
            {
                settings.ApiBaseUrl = GetEnvironmentVariable("DOCKER_HUB_API_BASE_URL");
                settings.RepositoriesUrl = GetEnvironmentVariable("DOCKER_HUB_REPOSITORIES_URL");
                settings.UserName = GetEnvironmentVariable("DOCKER_HUB_USERNAME");
                settings.Password = GetEnvironmentVariable("DOCKER_HUB_PASSWORD");
            });
            services.Configure<StorageSettings>(settings =>
            {
                settings.ConnectionString = GetEnvironmentVariable(
                    "AZURE_STORAGE_CONNECTION_STRING"
                );
                settings.ContainerName = GetEnvironmentVariable("AZURE_STORAGE_CONTAINER_NAME");
            });
        }

        services.Configure<JwtSettings>(options =>
        {
            options.Key = jwtSettings.Key;
            options.Issuer = jwtSettings.Issuer;
            options.Audience = jwtSettings.Audience;
        });

        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Transient;
        });
        services.InitMassTransit(environment);
        return services;
    }
}
