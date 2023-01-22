using MassTransit;

namespace dotnetapi;

public record PingMessage
{
    public string Pong { get; set; } = default!;
}

public interface UpdateAccount
{
    public int Id { get; set; }
}

public class AccountConsumer : IConsumer<UpdateAccount>
{
    public Task Consume(ConsumeContext<UpdateAccount> context)
    {
        return Task.CompletedTask;
    }
}

public class Worker : BackgroundService
{
    private readonly IBus _bus;

    public Worker(IBus bus)
    {
        _bus = bus;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await _bus.Publish(new PingMessage
            {
                Pong = "Pong"
            }, stoppingToken);

            await Task.Delay(1000);
        }
    }
}