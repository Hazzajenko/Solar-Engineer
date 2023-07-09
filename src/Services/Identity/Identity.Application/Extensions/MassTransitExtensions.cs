using System.Reflection;
using System.Security.Authentication;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Identity.Application.Extensions;

public static class MassTransitExtensions
{
    public static IServiceCollection InitMassTransit(
        this IServiceCollection services,
        IWebHostEnvironment environment
    )
    {
        services.AddMassTransit(x =>
        {
            x.SetKebabCaseEndpointNameFormatter();
            x.SetInMemorySagaRepositoryProvider();

            Assembly assembly = typeof(IIdentityApplicationAssemblyMarker).Assembly;

            x.AddConsumers(assembly);
            x.AddSagaStateMachines(assembly);
            x.AddSagas(assembly);
            x.AddActivities(assembly);

            x.HandleRabbitMqBasedOnEnvironment(environment);
        });

        return services;
    }

    private static void HandleRabbitMqBasedOnEnvironment(
        this IBusRegistrationConfigurator x,
        IWebHostEnvironment environment
    )
    {
        var rabbitMqConnectionString = environment.IsDevelopment() ? "localhost" : "rabbitmq";
        var testing = Environment.GetEnvironmentVariable("IS_TEST_ENVIRONMENT");
        var isRabbitMqEnabled = Environment.GetEnvironmentVariable("IS_RABBITMQ_ENABLED");
        x.UsingRabbitMq(
            (context, cfg) =>
            {
                if (testing == "true" && isRabbitMqEnabled == "true")
                {
                    var host = Environment.GetEnvironmentVariable("TEST_RABBITMQ_HOST");
                    var portString = Environment.GetEnvironmentVariable("TEST_RABBITMQ_PORT");
                    ushort port = ushort.Parse(portString!);
                    cfg.Host(
                        host!,
                        port,
                        "/",
                        h =>
                        {
                            h.Username("guest");
                            h.Password("guest");
                        }
                    );
                }
                else
                {
                    cfg.Host(
                        rabbitMqConnectionString,
                        "/",
                        h =>
                        {
                            h.Username("guest");
                            h.Password("guest");
                        }
                    );
                }

                cfg.ConfigureEndpoints(context);
            }
        );
    }
}
