using EventBus.Domain;
using Infrastructure.Extensions;
using Infrastructure.Settings;
using MassTransit;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Serilog;


namespace EventBus.Services;

public class EventPublisherService : IEventPublisherService
{
    private readonly IBus _bus;
    private readonly ILogger<EventPublisherService> _logger;
    private readonly IOptions<QueueSettings> _queues;

    public EventPublisherService(IBus bus, ILogger<EventPublisherService> logger,  IOptions<QueueSettings> queues)
    {
        _bus = bus;
        _logger = logger;
        _queues = queues;
    }

    public async Task PublishAsync<T>(T eventBase)
    where T : IEventBase
    {
        _logger.LogInformation("Sending Event {EventType}", eventBase.EventType);
        var uriList = _queues.Value.AppUserEvent.Select(queue => new Uri($"rabbitmq://localhost/{eventBase.EventType}-{queue}"));
        // var endpoints = await uriList.SelectAsync(async (uri) => await _bus.GetSendEndpoint(uri));
        var endpoints = await uriList.ToAsyncEnumerable()
            .SelectAwait(async uri => await _bus.GetSendEndpoint(uri))
            .ToListAsync();
        
        foreach (var sendEndpoint in endpoints)
        {
           await sendEndpoint.Send(eventBase);
           _logger.LogInformation("Sent Event");
        }
    }
}