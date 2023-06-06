using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Identity.Application.Extensions;

public static class MassTransitExtensions
{
    public static IServiceCollection InitMassTransit(this IServiceCollection services,
        IWebHostEnvironment environment)
    {
        services.AddMassTransit(x =>
        {
            x.SetKebabCaseEndpointNameFormatter();
            x.SetInMemorySagaRepositoryProvider();

            var assembly = typeof(IIdentityApplicationAssemblyMarker).Assembly;

            x.AddConsumers(assembly);
            x.AddSagaStateMachines(assembly);
            x.AddSagas(assembly);
            x.AddActivities(assembly);

            var rabbitMqConnectionString = environment.IsDevelopment()
                ? "localhost"
                : "rabbitmq";

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(rabbitMqConnectionString, "/", h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });
                cfg.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}
