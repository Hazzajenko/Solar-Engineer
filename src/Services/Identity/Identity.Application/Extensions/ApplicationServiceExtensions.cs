using Identity.Application.Data.UnitOfWork;
using Identity.Application.Repositories.AppUsers;
using Identity.Application.Repositories.Notifications;
using Identity.Application.Services.DockerHub;
using Identity.Application.Services.Jwt;
using Identity.Application.Settings;
using Identity.SignalR.Services;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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

        services.Configure<DockerHubSettings>(config.GetSection("DockerHub"));

        services.Configure<JwtSettings>(options =>
        {
            options.Key = jwtSettings.Key;
            options.Issuer = jwtSettings.Issuer;
            options.Audience = jwtSettings.Audience;
        });

        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.Configure<StorageSettings>(config.GetSection("Azure:Storage"));

        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Transient;
        });
        services.InitMassTransit(environment);
        return services;
    }
}
