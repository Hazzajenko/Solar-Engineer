using EventBus.Common;
using EventBus.Domain.AppUserEvents;
using Marten;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Oakton.Resources;
using Weasel.Core;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;
using Wolverine.Marten;
using Wolverine.RabbitMQ;

namespace Identity.Application.Extensions.ServiceCollection;

public static class IdentityWolverineConfig
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

    public static IHostBuilder InitIdentityWolverine(this IHostBuilder builder, IConfiguration config)
    {
        // TODO - This is temporary, change
        var connectionString =
            config.GetConnectionString("PostgresConnection")
            ?? throw new ArgumentNullException(nameof(InitMarten));
        builder.UseWolverine(opts =>
        {
            opts.Services
                .AddMarten(opts =>
                {
                    // services.
                    /*var connectionString =
                        config.GetConnectionString("PostgresConnection")
                        ?? throw new ArgumentNullException(nameof(InitMarten));*/

                    opts.Connection(connectionString);

                    // opts.AutoCreateSchemaObjects = AutoCreate.None;

                    // opts.Schema.For<CurrentUserDto>();
                    opts.Schema.For<AppUserEvent>().Identity(x => x.UserId);

                    // opts.Schema.For<WebConnection>().Index(x => x.UserId);

                    // opts.DatabaseSchemaName = "orders";
                })
                .ApplyAllDatabaseChangesOnStartup()
                .AssertDatabaseMatchesConfigurationOnStartup()
                .UseLightweightSessions()
                .IntegrateWithWolverine();

            /*var connectionString =
                config.GetConnectionString("PostgresConnection")
                ?? throw new ArgumentNullException(nameof(InitWolverine));
            opts.PersistMessagesWithPostgresql(connectionString);*/

            // Set up Entity Framework Core as the support
            // for Wolverine's transactional middleware
            opts.UseEntityFrameworkCoreTransactions();
            opts.UseFluentValidation();

            // Enrolling all local queues into the
            // durable inbox/outbox processing
            opts.Policies.UseDurableLocalQueues();
            opts.Policies.UseDurableOutboxOnAllSendingEndpoints();
            // opts.
            opts.Services.AddLogging();
            opts.Policies.LogMessageStarting(LogLevel.Information);

            // opts.Policies.Audit<IAppUserEventMessage>(x => x.Id);
            // opts.Policies.Audit<IAppUserEventMessage>(x => x.UserId);
            opts.UseRabbitMq(rabbit =>
                {
                    // Using a local installation of Rabbit MQ
                    // via a running Docker image
                    rabbit.HostName = MessageQueues.LocalHost;
                    // rabbit.HostName = "localhost";
                })
                /*.DeclareExchange(
                    MessageQueues.AppUsers.EventsExchange,
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue(MessageQueues.AppUsers.EventsQueue);
                    }
                )*/
                // Direc // This is short hand to connect locally
                /*.DeclareExchange(
                    MessageQueues.AppUsers.EventResponsesExchange,
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue(MessageQueues.AppUsers.EventResponsesQueue);
                    }
                )*/
                .AutoProvision()
                .AutoPurgeOnStartup();
            // Going to listen to a queue named "pings", but disregard any messages older than
            // 15 seconds
            // opts.ListenToRabbitQueue("pings", queue => queue.TimeToLive(15.Seconds()));

            /*opts.ListenToRabbitQueue("pongs")
                // This won't be necessary by the time Wolverine goes 2.0
                // but for now, I've got to help Wolverine out a little bit
                .UseForReplies();*/

            // opts.DefaultLocalQueue.UseDurableInbox();
            // opts.LocalQueue("Notifications").UseDurableInbox();

            opts.ListenToRabbitQueue(MessageQueues.AppUsers.EventResponsesQueue)
                .UseForReplies();

            // opts.PublishMessage<PingMessage>().ToRabbitExchange("pings");
            opts.PublishMessage<AppUserEvent>()
                .ToRabbitExchange(
                    MessageQueues.AppUsers.EventsExchange
                    // e => e.AutoDelete = false
                    /*{
                        x.BindQueue(
                            "appuser-events" , "appuser-events_appuser-events"#2#
                        );
                    }*/
                )
                .UseDurableOutbox();
            // MessageQueues.AppUsers.EventsExchange);
            /*opts.PublishMessage<AppUserEvent>()
                .ToRabbitExchange(
                    MessageQueues.AppUsers.EventsExchange,
                    e =>
                    {
                        e.ExchangeType = ExchangeType.Fanout;
                        // e.
                        e.BindQueue(
                            MessageQueues.AppUsers.EventsQueue,
                            $"{MessageQueues.AppUsers.EventsQueue}-binding"
                        );
                    }
                );*/
            // .ToRabbitExchange(MessageQueues.AppUsers.EventsExchange);

            // opts.LocalQueue("Notifications").Use();
            // opts.PublishMessage<AppUserEvent>().ToRabbitExchange("appusers");

            // Configure Rabbit MQ connections and optionally declare Rabbit MQ
            // objects through an extension method on WolverineOptions.Endpoints


            opts.Policies.AutoApplyTransactions();
            opts.Services.AddResourceSetupOnStartup();

            // opts.Services.AddHostedService<PingerService>();
        });
        return builder;
    }
}