using EventBus.Domain.ProjectsEvents;
using Humanizer;
using Microsoft.Extensions.Hosting;
using Wolverine;
using Wolverine.RabbitMQ;

namespace Projects.Application.Extensions;

public static class WolverineExtensions
{
    /*public static IServiceCollection InitMarten(
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

                opts.Schema.For<CurrentUserDto>();
                opts.Schema.For<WebConnection>().Index(x => x.UserId);

                // opts.DatabaseSchemaName = "orders";
            })
            .ApplyAllDatabaseChangesOnStartup()
            .AssertDatabaseMatchesConfigurationOnStartup()
            .UseLightweightSessions();
        // Optionally add Marten/Postgresql integration
        // with Wolverine's outbox
        // .IntegrateWithWolverine();
        return services;
    }*/

    public static IHostBuilder InitWolverine(this IHostBuilder builder, string[] args = null)
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

            opts.ListenToRabbitQueue("pings", queue => queue.TimeToLive(15.Seconds()));
            opts.ListenToRabbitQueue("appusers", queue => queue.TimeToLive(15.Seconds()));

            opts.PublishMessage<ProjectEvent>().ToRabbitExchange("projects");

            opts.UseRabbitMq() // This is short hand to connect locally
                .DeclareExchange(
                    "appusers",
                    exchange =>
                    {
                        // Also declares the queue too
                        exchange.BindQueue("appusers");
                    }
                )
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