using EventBus.Common;
using EventBus.Domain.AppUserEvents;
using Marten;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Oakton.Resources;
using Weasel.Core;
using Wolverine;
using Wolverine.Marten;
using Wolverine.RabbitMQ;

namespace Identity.Application.Extensions.ServiceCollection;

public static class WolverineExtensions
{
    public static IServiceCollection InitMarten(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services
            .AddMarten(opts =>
            {
                // services.
                var connectionString =
                    config.GetConnectionString("PostgresConnection")
                    ?? throw new ArgumentNullException(nameof(InitMarten));

                opts.Connection(connectionString);

                opts.AutoCreateSchemaObjects = AutoCreate.None;

                // opts.Schema.For<CurrentUserDto>();
                opts.Schema.For<AppUserEvent>();

                // opts.Schema.For<WebConnection>().Index(x => x.UserId);

                // opts.DatabaseSchemaName = "orders";
            })
            .ApplyAllDatabaseChangesOnStartup()
            .AssertDatabaseMatchesConfigurationOnStartup()
            .UseLightweightSessions()
            .IntegrateWithWolverine();
        // Optionally add Marten/Postgresql integration
        // with Wolverine's outbox
        // .IntegrateWithWolverine();
        return services;
    }

    /*public const string AppUserEventsQueue = "appuser-events";*/

    public static IHostBuilder InitWolverine(this IHostBuilder builder)
    {
        // TODO - This is temporary, change

        builder.UseWolverine(opts =>
        {
            // Going to listen to a queue named "pings", but disregard any messages older than
            // 15 seconds
            // opts.ListenToRabbitQueue("pings", queue => queue.TimeToLive(15.Seconds()));

            /*opts.ListenToRabbitQueue("pongs")
                // This won't be necessary by the time Wolverine goes 2.0
                // but for now, I've got to help Wolverine out a little bit
                .UseForReplies();*/

            opts.ListenToRabbitQueue(MessageQueues.AppUsers.EventResponsesQueue)
                .UseForReplies();

            // opts.PublishMessage<PingMessage>().ToRabbitExchange("pings");
            opts.PublishMessage<AppUserEvent>()
                .ToRabbitExchange(MessageQueues.AppUsers.EventsExchange);
            // opts.PublishMessage<AppUserEvent>().ToRabbitExchange("appusers");

            // Configure Rabbit MQ connections and optionally declare Rabbit MQ
            // objects through an extension method on WolverineOptions.Endpoints
            opts.UseRabbitMq(rabbit =>
                {
                    // Using a local installation of Rabbit MQ
                    // via a running Docker image
                    rabbit.HostName = MessageQueues.LocalHost;
                    // rabbit.HostName = "localhost";
                })
                // Direc // This is short hand to connect locally
                /*.DeclareExchange(
                    "pings",
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue("pings");
                    }
                )*/
                .DeclareExchange(
                    MessageQueues.AppUsers.EventResponsesExchange,
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue(MessageQueues.AppUsers.EventResponsesQueue);
                    }
                )
                .AutoProvision()
                // Option to blow away existing messages in
                // all queues on application startup
                .AutoPurgeOnStartup();

            opts.Policies.AutoApplyTransactions();
            opts.Services.AddResourceSetupOnStartup();

            // opts.Services.AddHostedService<PingerService>();
        });
        return builder;
    }
}