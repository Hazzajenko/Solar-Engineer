using Identity.Application.Services.Pinger;
using JasperFx.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Oakton.Resources;
using Wolverine;
using Wolverine.RabbitMQ;

namespace Identity.Application.Extensions.ServiceCollection;

public static class WolverineExtensions
{
    public static IHostBuilder InitWolverine(this IHostBuilder builder)
    {
        // TODO - This is temporary, change

        builder.UseWolverine(opts =>
        {
            // Going to listen to a queue named "pings", but disregard any messages older than
            // 15 seconds
            opts.ListenToRabbitQueue("pings", queue => queue.TimeToLive(15.Seconds()));

            opts.ListenToRabbitQueue("pongs")
                // This won't be necessary by the time Wolverine goes 2.0
                // but for now, I've got to help Wolverine out a little bit
                .UseForReplies();

            opts.PublishMessage<PingMessage>().ToRabbitExchange("pings");

            // Configure Rabbit MQ connections and optionally declare Rabbit MQ
            // objects through an extension method on WolverineOptions.Endpoints
            opts.UseRabbitMq(rabbit =>
                {
                    // Using a local installation of Rabbit MQ
                    // via a running Docker image
                    rabbit.HostName = "localhost";
                })
                // Direc // This is short hand to connect locally
                .DeclareExchange(
                    "pings",
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue("pings");
                    }
                )
                .AutoProvision()
                // Option to blow away existing messages in
                // all queues on application startup
                .AutoPurgeOnStartup();

            opts.Services.AddResourceSetupOnStartup();

            opts.Services.AddHostedService<PingerService>();
        });
        return builder;
    }
}