using EventBus.Domain;
using Microsoft.Extensions.Logging;

namespace EventBus.Services;

public class OutboxSenderService
{
    private readonly ILogger<OutboxSenderService> _logger;

    public OutboxSenderService(ILogger<OutboxSenderService> logger)
    {
        _logger = logger;
    }

    public async Task PublishAsync<T>(T eventBase)
        where T : IEventBase
    {
        /*_logger.LogInformation("Sending Event {EventType}", eventBase.EventType);
        var uriList = _queues.Value.AppUserEvent.Select(queue => new Uri($"rabbitmq://localhost/{eventBase.EventType}-{queue}"));
        // var endpoints = await uriList.SelectAsync(async (uri) => await _bus.GetSendEndpoint(uri));
        var endpoints = await uriList.ToAsyncEnumerable()
            .SelectAwait(async uri => await _bus.GetSendEndpoint(uri))
            .ToListAsync();
        
        foreach (var sendEndpoint in endpoints)
        {
           await sendEndpoint.Send(eventBase);
           _logger.LogInformation("Sent Event");
        }*/
    }
}