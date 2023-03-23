using System.Reflection;
using EventBus.Services;
using Identity.API.Deprecated.Services;
using Identity.API.Deprecated.Settings;

// using Auth.API.RabbitMQ;

// using Autofac;
// using EventBus;
// using EventBus.Abstractions;

// using MassTransit;

// using MassTransit;
// using MassTransit;
// using MassTransit;
// using RabbitMQ.Client;

namespace Identity.API.Deprecated.Extensions.Services;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config,
        Assembly assembly
    )
    {
        // services.Configure<QueueSettings>(config.GetSection("Queues"));
        /*services.AddScoped<IAuthUnitOfWork, AuthUnitOfWork>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IAppUserRepository, AppUserRepository>();*/
        // services.InitMediator();
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });
        services.InitMassTransit(config, assembly);
        services.AddTransient<IEventPublisherService, EventPublisherService>();
        // adds user and client access token management
        /*
        services.AddAccessTokenManagement(options =>
        {
            options.Client.Clients.Add("client", new ClientCredentialsTokenRequest
            {
                Address = config["IdentityServerSettings:TokenEndpoint"],
                ClientId = config["IdentityServerSettings:ClientId"],
                ClientSecret = config["IdentityServerSettings:ClientSecret"],
                Scope = config["IdentityServerSettings:Scopes"]
                /*Address = "https://demo.duendesoftware.com/connect/token",
                ClientId = "m2m",
                ClientSecret = "secret",
                Scope = "api"#1#
            });
        });
        */

        services.Configure<IdentityServerSettings>(config.GetSection("IdentityServerSettings"));
        services.AddSingleton<ITokenService, TokenService>();
        services.AddLogging(options => { options.AddFilter("Duende", LogLevel.Debug); });
        /*services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(@"c:\keys"))
            .SetApplicationName("SharedCookieApp");

        services.ConfigureApplicationCookie(options => {
            options.Cookie.Name = ".AspNet.SharedCookie";
            options.Cookie.Path = "/";
        });*/
        /*.AddTransientHttpErrorPolicy(policy => policy.WaitAndRetryAsync(new[]
    {
        TimeSpan.FromSeconds(1),
        TimeSpan.FromSeconds(2),
        TimeSpan.FromSeconds(3)
    }));*/
        // services.AddSingleton<IUserAccessTokenStore>();/*<IUserAccessTokenStore, AuthenticationSessionUserAccessTokenStore>();*/
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