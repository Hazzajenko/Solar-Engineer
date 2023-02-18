using System.Reflection;
using Auth.API.Data;
using Auth.API.Repositories;
using Auth.API.Services;
using EventBus.Services;
using Infrastructure.Settings;

// using Auth.API.RabbitMQ;

// using Autofac;
// using EventBus;
// using EventBus.Abstractions;

// using MassTransit;

// using MassTransit;
// using MassTransit;
// using MassTransit;
// using RabbitMQ.Client;

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
        // services.AddMassTransitHostedService();
        /*services.AddTransient<ICatalogIntegrationEventService, CatalogIntegrationEventService>();
        services.AddSingleton<IRabbitMqPersistentConnection>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<DefaultRabbitMqPersistentConnection>>();


            var factory = new ConnectionFactory
            {
                HostName = config["EventBusConnection"],
                DispatchConsumersAsync = true
            };

            /*if (!string.IsNullOrEmpty(configuration["EventBusUserName"]))
            {
                factory.UserName = configuration["EventBusUserName"];
            }

            if (!string.IsNullOrEmpty(configuration["EventBusPassword"]))
            {
                factory.Password = configuration["EventBusPassword"];
            }#1#

            var retryCount = 5;
            /*if (!string.IsNullOrEmpty(configuration["EventBusRetryCount"]))
            {
                retryCount = int.Parse(configuration["EventBusRetryCount"]);
            }#1#

            return new DefaultRabbitMqPersistentConnection(factory, logger, retryCount);
        });

        services.AddSingleton<IEventBus, EventBusRabbitMq>(sp =>
        {
            var subscriptionClientName = config["SubscriptionClientName"];
            var rabbitMQPersistentConnection = sp.GetRequiredService<IRabbitMqPersistentConnection>();
            var iLifetimeScope = sp.GetRequiredService<ILifetimeScope>();
            var logger = sp.GetRequiredService<ILogger<EventBusRabbitMq>>();
            var eventBusSubcriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

            var retryCount = 5;
            if (!string.IsNullOrEmpty(config["EventBusRetryCount"]))
                retryCount = int.Parse(config["EventBusRetryCount"]);

            return new EventBusRabbitMq(rabbitMQPersistentConnection, logger, iLifetimeScope,
                eventBusSubcriptionsManager, subscriptionClientName, retryCount);
        });

        services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();*/

        /*
        var container = new ContainerBuilder();
        container.Populate(services);*/

        // return new AutofacServiceProvider(container.Build());

        return services;
    }
}