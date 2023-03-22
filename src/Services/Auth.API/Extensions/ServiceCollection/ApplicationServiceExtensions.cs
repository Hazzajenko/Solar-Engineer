using System.Reflection;
using Auth.API.Data;
using Auth.API.Repositories;
using Auth.API.Services;
using Auth.API.Services.Images;
using Auth.API.Settings;
using Infrastructure.Settings;

namespace Auth.API.Extensions.ServiceCollection;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config,
        Assembly assembly
    )
    {
        services.Configure<QueueSettings>(config.GetSection("Queues"));
        services.AddScoped<IAuthUnitOfWork, AuthUnitOfWork>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        services.AddScoped<IImagesService, ImagesService>();
        services.Configure<StorageSettings>(config.GetSection("Azure:Storage"));
        // services.InitMediator();
        // services.AddMediator(options => options.Namespace = "Auth.API");
        // services.AddSingleton(typeof(IPipelineBehavior<,>), typeof(ErrorLoggerHandler<,>));
        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Transient;
            // options.Namespace = "Auth.API";
        });
        // services.InitMassTransit(config, assembly);
        // services.AddTransient<IEventPublisherService, EventPublisherService>();
        /*services.AddSignalR().AddStackExchangeRedis("localhost", options => {
            options.Configuration.ChannelPrefix = "SolarEngineerApp";
        });*/

        return services;
    }
}