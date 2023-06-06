using EventBus.Common;
using EventBus.Domain.ProjectsEvents;
using Humanizer;
using Marten;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Npgsql;
using Oakton.Resources;
using Wolverine;
using Wolverine.ErrorHandling;
using Wolverine.Marten;
using Wolverine.RabbitMQ;

namespace Projects.Application.Extensions;

public static class ProjectsWolverineConfig
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

                /*opts.AutoCreateSchemaObjects = AutoCreate.None;

                // opts.Schema.For<CurrentUserDto>();
                opts.Schema.For<AppUserEvent>();*/

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

    public static IHostBuilder InitProjectsWolverine(this IHostBuilder builder, IConfiguration config)
    {
        // TODO - This is temporary, change
        var connectionString =
            config.GetConnectionString("PostgresConnection")
            ?? throw new ArgumentNullException(nameof(InitProjectsWolverine));
        builder.UseWolverine(opts =>
        {
            /*var connectionString =
                config.GetConnectionString("PostgresConnection")
                ?? throw new ArgumentNullException(nameof(InitWolverine));*/
            // opts.PersistMessagesWithPostgresql(connectionString);

            opts.Services
                .AddMarten(opts =>
                {
                    // services.
                    /*var connectionString =
                        config.GetConnectionString("PostgresConnection")
                        ?? throw new ArgumentNullException(nameof(InitMarten));*/

                    opts.Connection(connectionString);

                    // opts.Projections.Add<UserSummaryProjector>(ProjectionLifecycle.Inline);

                    // opts.AutoCreateSchemaObjects = AutoCreate.None;

                    // opts.Schema.For<CurrentUserDto>();
                    // opts.Schema.For<AppUserEvent>();
                    // opts.Schema.For<ProjectEvent>();

                    // opts.Schema.For<ProjectUser>();
                    // opts.Schema.For<AppUserProject>();

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
            // return services;

            opts.UseRabbitMq() // This is short hand to connect locally
                .DeclareExchange(
                    // MessageQueues.AppUsers.EventsQueue,
                    MessageQueues.AppUsers.EventsExchange,
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue(MessageQueues.AppUsers.EventsQueue);
                        // exchange.BindQueue(MessageQueues.AppUsers.EventsQueue);
                    }
                )
                /*.DeclareExchange(
                    "pings",
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue("pings");
                    }
                )*/
                .AutoProvision()
                // Option to blow away existing messages in
                // all queues on application startup
                .AutoPurgeOnStartup();
            // Going to listen to a queue named "pings", but disregard any messages older than
            // 15 seconds
            // opts.ListenToRabbitQueue("pings", queue => queue.TimeToLive(15.Seconds()));

            /*opts.ListenToRabbitQueue("pongs")
                // This won't be necessary by the time Wolverine goes 2.0
                // but for now, I've got to help Wolverine out a little bit
                .UseForReplies();*/
            opts.Services.AddLogging();
            opts.Policies.LogMessageStarting(LogLevel.Information);

            // opts.Policies.Audit<IAppUserEventMessage>(x => x.Id);

            // opts.DefaultLocalQueue.UseDurableInbox();
            // opts.LocalQueue("Notifications").UseDurableInbox();

            // opts.ListenToRabbitQueue("pings", queue => queue.TimeToLive(15.Seconds()));
            opts.ListenToRabbitQueue(
                    // MessageQueues.AppUsers.Events,
                    MessageQueues.AppUsers.EventsQueue,
                    queue => queue.TimeToLive(15.Seconds())
                )
                .UseDurableInbox();

            /*opts.PublishMessage<AppUserEventResponse>()
                .ToRabbitExchange(MessageQueues.AppUsers.EventResponsesExchange);*/
            /*.UseDurableInbox()*/
            // opts.ListenToRabbitQueue("appusers", queue => queue.TimeToLive(15.Seconds()));
            // opts.ListenToRabbitQueue("appusers", queue => queue.TimeToLive(15.Seconds()));

            opts.PublishMessage<ProjectEvent>()
                .ToRabbitExchange(MessageQueues.Projects.EventsExchange);
            /*.UseDurableOutbox()*/
            // opts.PublishMessage<ProjectEvent>().ToRabbitExchange("projects");

            /*opts.UseRabbitMq() // This is short hand to connect locally
                .DeclareExchange(
                    // MessageQueues.AppUsers.EventsQueue,
                    MessageQueues.AppUsers.EventsExchange,
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue(MessageQueues.AppUsers.EventsQueue);
                        // exchange.BindQueue(MessageQueues.AppUsers.EventsQueue);
                    }
                )
                /*.DeclareExchange(
                    "pings",
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue("pings");
                    }
                )#1#
                .AutoProvision()
                // Option to blow away existing messages in
                // all queues on application startup
                .AutoPurgeOnStartup();*/

            // opts.Auto
            opts.Policies.AutoApplyTransactions();
            opts.Services.AddResourceSetupOnStartup();

            opts.Policies
                .OnException<NpgsqlException>()
                .RetryWithCooldown(50.Milliseconds(), 100.Milliseconds(), 250.Milliseconds());

            // Configure Rabbit MQ connections and optionally declare Rabbit MQ
            // objects through an extension method on WolverineOptions.Endpoints
            /*opts.UseRabbitMq(rabbit =>
                {
                    // Using a local installation of Rabbit MQ
                    // via a running Docker image
                    rabbit.HostName = "localhost";
                })
                // Direc // This is short hand to connect locally
                /*.DeclareExchange(
                    "pings",
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue("pings");
                    }
                )#1#
                .AutoProvision()
                // Option to blow away existing messages in
                // all queues on application startup
                .AutoPurgeOnStartup();*/

            // opts.Services.AddResourceSetupOnStartup();

            // opts.Services.AddHostedService<PingerService>();
        });
        return builder;
    }
}

public class UserSummary
{
    public Guid Id { get; set; }

    public List<string> Logs { get; set; } = new();
}

/*public class UserSummaryProjector : MultiStreamAggregation<UserSummary, Guid>
{
    public UserSummaryProjector()
    {
        Identity<IAppUserEventResponse>(x => x.Id);
    }

    public void Apply(UserSummary snapshot, UserCreated e)
    {
        snapshot.Logs.Add($"{e.Id} created");
    }

    /*public void Apply(UserSummary snapshot, User e)
    {
        snapshot.Comments.Add(e.Content);
    }#1#
}*/
