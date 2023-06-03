using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Application.Extensions;

public static class MassTransitExtensions
{
    public static IServiceCollection InitMassTransit(this IServiceCollection services)
    {
        services.AddMassTransit(x =>
        {
            x.SetKebabCaseEndpointNameFormatter();

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host("localhost", "/", h =>
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