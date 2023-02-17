using Auth.API.Data;
using Auth.API.Repositories;
using Auth.API.Services;
using DotNetCore.EntityFrameworkCore;
using EventBus.Domain.AppUserEvents.Events;
using MassTransit.Transports.Fabric;

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
        IConfiguration config
    )
    {
        // services.AddIdentityServices().
        // services.AddScoped<ILifetimeScope>();
        // services.AddScoped<IAuthContext>(provider => provider.GetService<AuthContext>()!);
        services.AddScoped<IAuthContext>(provider => provider.GetService<AuthContext>()!);
        // services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAuthService, AuthService>();
        // services.AddScoped<ICustomUserManager, CustomUserManager>();
        // services.Replace(ServiceDescriptor.Scoped(typeof(UserManager<AppUser>), typeof(CustomUserManager)));
        services.AddScoped<IAppUserRepository, AppUserRepository>();
        // services.AddScoped<IMessageProducer, RabbitMqProducer>();
        services.AddScoped<IUnitOfWork, AuthContext>();
        // services.AddMediator()
        // services.AddJwtService(options => options.);
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        services.AddMassTransit(x =>
        {
            // x.UsingRabbitMq();
            // x.AddConsumer<TicketConsumer>();
            // x.AddConsumer<CreatedAppUserConsumer>();
            
            x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(config =>
            {
                // config.UseHealthCheck(provider);
                config.Host(new Uri("rabbitmq://localhost"), h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });
                /*config.Publish<AppUserLoggedInEvent>(options =>
                {
                    options.ExchangeType = ExchangeType.FanOut;
                });*/
                /*config.ReceiveEndpoint("ticketQueue", ep =>
                {
                    ep.PrefetchCount = 16;
                    ep.UseMessageRetry(r => r.Interval(2, 100));
                    ep.ConfigureConsumer<TicketConsumer>(provider);
                });*/
            }));
        });
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