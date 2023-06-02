using Identity.Application.Data.UnitOfWork;
using Identity.Application.Repositories.AppUsers;
using Identity.Application.Services.Images;
using Identity.Application.Services.Jwt;
using Identity.Application.Settings;
using Identity.SignalR.Services;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Application.Extensions.ServiceCollection;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        // services.Configure<QueueSettings>(config.GetSection("Queues"));
        services.AddSingleton<ConnectionsService>();
        services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        services.AddScoped<IImagesService, ImagesService>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.Configure<JwtSettings>(config.GetSection("Jwt"));
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.Configure<StorageSettings>(config.GetSection("Azure:Storage"));

        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });

        // services.UseWolverine();

        return services;
    }
}