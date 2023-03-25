using JasperFx.Core;
using Microsoft.Extensions.Hosting;
using Wolverine;

namespace Identity.Application.Services.Pinger;

public class PingMessage
{
    public int Number { get; set; }
}

public class PongMessage
{
    public int Number { get; set; }
}

// Just a simple IHostedService object that will publish
// a new PingMessage every second
public class PingerService : IHostedService
{
    // IMessagePublisher is an interface you can use
    // strictly to publish messages through Wolverine
    private readonly IMessageBus _bus;

    public PingerService(IMessageBus bus)
    {
        _bus = bus;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        return Task.Run(
            async () =>
            {
                var count = 0;

                while (!cancellationToken.IsCancellationRequested)
                {
                    var message = new PingMessage { Number = ++count };

                    await _bus.SendAsync(message);

                    await Task.Delay(1.Seconds(), cancellationToken);
                }
            },
            cancellationToken
        );
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}