using Identity.Application.Data.UnitOfWork;
using Identity.Application.Repositories.AppUsers;
using Identity.Application.Services.Images;
using Identity.Application.Settings;
using Identity.SignalR.Services;
using Infrastructure.Settings;
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
        services.Configure<QueueSettings>(config.GetSection("Queues"));
        services.AddSingleton<ConnectionsService>();
        services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        services.AddScoped<IImagesService, ImagesService>();
        services.Configure<StorageSettings>(config.GetSection("Azure:Storage"));
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });

        // services.UseWolverine();

        return services;
    }
}