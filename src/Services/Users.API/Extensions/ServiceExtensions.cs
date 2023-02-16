// using Auth.API.Events;

// using DotNetCore.EntityFrameworkCore;
using Infrastructure.Grpc;
using MassTransit;
using Users.API.Data;
using Users.API.Events;
using Users.API.Grpc;
using Users.API.Repositories;

namespace Users.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddAppServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddTransient<GrpcExceptionInterceptor>();
        // services.AddScoped<IUserLinksRepository, UserLinksRepository>();
        services.AddScoped<IAuthGrpcService, AuthGrpcService>();
        // services.AddScoped<IUsersContext, UsersContext>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        services.AddScoped<ITrackContext, UsersContext>();
        services.AddScoped<IUserLinksRepository, UserLinksRepository>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        // services.AddScoped<IUsersContext, UsersContext>();

        /*
        services.AddSingleton<IRabbitMqPersistentConnection>(sp =>
        {
            var logger = sp.GetRequiredService<ILogger<DefaultRabbitMqPersistentConnection>>();

            var factory = new ConnectionFactory
            {
                HostName = "localhost",
                // HostName = Configuration["EventBusConnection"],
                DispatchConsumersAsync = true
            };

            /*if (!string.IsNullOrEmpty(Configuration["EventBusUserName"]))
            {
                factory.UserName = Configuration["EventBusUserName"];
            }

            if (!string.IsNullOrEmpty(Configuration["EventBusPassword"]))
            {
                factory.Password = Configuration["EventBusPassword"];
            }#1#

            var retryCount = 5;
            /*if (!string.IsNullOrEmpty(Configuration["EventBusRetryCount"]))
            {
                retryCount = int.Parse(Configuration["EventBusRetryCount"]);
            }#1#

            return new DefaultRabbitMqPersistentConnection(factory, logger, retryCount);
        });

        services.AddSingleton<IEventBus, EventBusRabbitMq>(sp =>
        {
            var subscriptionClientName = config["SubscriptionClientName"];
            var rabbitMqPersistentConnection = sp.GetRequiredService<IRabbitMqPersistentConnection>();
            var iLifetimeScope = sp.GetRequiredService<ILifetimeScope>();
            var logger = sp.GetRequiredService<ILogger<EventBusRabbitMq>>();
            var eventBusSubscriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

            var retryCount = 5;
            if (!string.IsNullOrEmpty(config["EventBusRetryCount"]))
                retryCount = int.Parse(config["EventBusRetryCount"]);

            return new EventBusRabbitMq(rabbitMqPersistentConnection, logger, iLifetimeScope,
                eventBusSubscriptionsManager, subscriptionClientName, retryCount);
        });

        services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();*/

        services.AddMassTransit(x =>
        {
            // x.UsingRabbitMq();
            // x.AddConsumer<TicketConsumer>();
            x.AddConsumer<CreatedAppUserConsumer>();
            x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(config =>
            {
                // config.UseHealthCheck(provider);
                config.Host(new Uri("rabbitmq://localhost"), h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });
                /*config.ReceiveEndpoint("ticketQueue", ep =>
                {
                    ep.PrefetchCount = 16;
                    ep.UseMessageRetry(r => r.Interval(2, 100));
                    ep.ConfigureConsumer<TicketConsumer>(provider);
                });*/
                config.ReceiveEndpoint("createdAppUserQueue", ep =>
                {
                    ep.PrefetchCount = 16;
                    ep.UseMessageRetry(r => r.Interval(2, 100));
                    ep.ConfigureConsumer<CreatedAppUserConsumer>(provider);
                });
            }));
        });

        return services;
    }
}