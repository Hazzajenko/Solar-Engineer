using System.Reflection;
using Auth.API.Data;
using Auth.API.Repositories;
using Auth.API.Services;
using EventBus.Services;
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
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        services.InitMassTransit(config, assembly);
        services.AddTransient<IEventPublisherService, EventPublisherService>();
        /*services.AddSignalR().AddStackExchangeRedis("localhost", options => {
            options.Configuration.ChannelPrefix = "SolarEngineerApp";
        });*/

        return services;
    }
}