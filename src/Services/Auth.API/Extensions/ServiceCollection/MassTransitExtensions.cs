using System.Reflection;

namespace Auth.API.Extensions.ServiceCollection;

public class Message
{
    public string Text { get; set; } = default!;
}

public static class MassTransitExtensions
{
    public static IServiceCollection InitMassTransit(
        this IServiceCollection services,
        IConfiguration config,
        Assembly assembly
    )
    {
        /*services.AddMassTransit(x =>
        {
            x.AddConsumers(assembly);
            x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(config =>
            {
                config.Host(new Uri("rabbitmq://localhost"), h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });
                // config.ConfigureMassTransitEndpoints(provider);
            }));
        });*/


        return services;
    }

    /*private static IBusRegistrationConfigurator AddMassTransitConsumers(this IBusRegistrationConfigurator x)
    {
        // x.AddConsumer<AppUserLoggedInConsumer>();
        // x.AddConsumer<ServiceBusConsumer>();
        return x;
    }

    private static IRabbitMqBusFactoryConfigurator ConfigureMassTransitEndpoints(
        this IRabbitMqBusFactoryConfigurator config, IBusRegistrationContext provider)
    {
        /*config.ReceiveEndpoint("AppUserLoggedInEvent-Users", ep =>
        {
            ep.PrefetchCount = 16;
            ep.UseMessageRetry(r => r.Interval(2, 100));
            ep.ConfigureConsumer<AppUserLoggedInConsumer>(provider);
        });#1#
        return config;
    }*/
}