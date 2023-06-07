using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Projects.Application.Extensions;

public static class MassTransitExtensions
{
    public static IServiceCollection InitMassTransit(this IServiceCollection services,
        IWebHostEnvironment webHostEnvironment)
    {
        services.AddMassTransit(x =>
        {
            x.SetKebabCaseEndpointNameFormatter();
            x.SetInMemorySagaRepositoryProvider();

            var assembly = typeof(IProjectsApplicationAssemblyMarker).Assembly;

            x.AddConsumers(assembly);
            x.AddSagaStateMachines(assembly);
            x.AddSagas(assembly);
            x.AddActivities(assembly);

            var host = webHostEnvironment.IsDevelopment() ? "localhost" : "rabbitmq";

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(host, "/", h =>
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