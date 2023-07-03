using System.Reflection;
using EventBus.Common;
using Infrastructure.Helpers;
using Infrastructure.Logging;
using JasperFx.Core;
using Marten;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Npgsql;
using Oakton.Resources;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.ErrorHandling;
using Wolverine.FluentValidation;
using Wolverine.Marten;
using Wolverine.RabbitMQ;
using Wolverine.RabbitMQ.Internal;

namespace EventBus.Wolverine;

public record ListenerQueue(string Queue, bool UsedForReplies = false);

public record SenderQueue(string Queue, Type Type);

public static class WolverineExtensions
{
    /**
     * This method is used to initialize Wolverine.
     * It is called from the Program class.
     */
    public static IHostBuilder InitWolverine(
        this IHostBuilder builder,
        IConfiguration config,
        ListenerQueue[] listenerQueues,
        SenderQueue[] senderQueues,
        Assembly assemblyType
    )
    {
        var connectionString = config.GetConnectionString("PostgresConnection");
        ArgumentNullException.ThrowIfNull(connectionString);
        builder.UseWolverine(opts =>
        {
            opts.Services
                .AddMarten(options => { options.Connection(connectionString); })
                .ApplyAllDatabaseChangesOnStartup()
                .AssertDatabaseMatchesConfigurationOnStartup()
                .UseLightweightSessions()
                .IntegrateWithWolverine();

            opts.UseRabbitMq(rabbit => { rabbit.HostName = MessageQueues.LocalHost; })
                .DeclareRabbitMqExchanges(
                    listenerQueues
                        .Where(x => x.UsedForReplies == false)
                        .Select(x => x.Queue)
                        .ToArray()
                )
                .AutoProvision()
                .AutoPurgeOnStartup();

            opts.Services.AddLogging();
            opts.Policies.LogMessageStarting(LogLevel.Information);

            foreach (var listenerQueue in listenerQueues)
                if (listenerQueue.UsedForReplies)
                    opts.ListenToRabbitQueue(
                            listenerQueue.Queue,
                            queue => queue.TimeToLive(15.Seconds())
                        )
                        .UseDurableInbox()
                        .UseForReplies();
                else
                    opts.ListenToRabbitQueue(
                            listenerQueue.Queue,
                            queue => queue.TimeToLive(15.Seconds())
                        )
                        .UseDurableInbox();

            foreach (var sender in senderQueues)
                Helpers.InvokeStaticGenericMethod(
                    typeof(WolverineExtensions),
                    "PublishToRabbitMqExchange",
                    new[] { sender.Type },
                    opts,
                    sender.Queue
                );

            // opts.Auto
            opts.UseEntityFrameworkCoreTransactions();
            opts.UseFluentValidation();
            opts.Policies.AutoApplyTransactions();
            opts.Services.AddResourceSetupOnStartup();

            opts.Policies
                .OnException<NpgsqlException>()
                .RetryWithCooldown(50.Milliseconds(), 100.Milliseconds(), 250.Milliseconds());

            // opts.Assemblies..Add(assemblyType);
            // opts.
            // opts.Discovery.IncludeAssembly(assemblyType);
            opts.ApplicationAssembly = assemblyType;
        });
        return builder;
    }

    private static RabbitMqTransportExpression DeclareRabbitMqExchanges(
        this RabbitMqTransportExpression transport,
        string[] queues
    )
    {
        foreach (var queueName in queues)
            transport.DeclareExchange(
                queueName,
                exchange => { exchange.BindQueue(queueName); }
            );
        return transport;
    }

    /// <summary>
    ///     Publish a message to a RabbitMQ exchange
    ///     This method is used to publish a message to a RabbitMQ exchange.
    ///     It is called from the InitWolverine method above.
    ///     It is a little bit of a hack, but it's the only way I could figure out how to get the generic
    ///     type of the message to be published to Rabbit MQ
    ///     DO NOT DELETE THIS METHOD
    /// </summary>
    public static WolverineOptions PublishToRabbitMqExchange<TMessage>(
        this WolverineOptions opts,
        string queueName
    )
        where TMessage : class
    {
        // Console.WriteLine(nameof(TMessage));
        // request.GetType().Name;
        var type = typeof(TMessage);
        Console.WriteLine(type.Name);

        opts.PublishMessage<TMessage>().ToRabbitExchange(queueName);
        return opts;
    }
}