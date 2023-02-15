using System.Text.Json;
using MassTransit;
using Microsoft.Extensions.Logging;

// using Newtonsoft.Json;

namespace Infrastructure.Events;

public record CreatedAppUser
{
    public Guid Id { get; set; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastActiveTime { get; set; } = DateTime.Now;
}

public class CreatedAppUserConsumer : IConsumer<CreatedAppUser>
{
    private readonly ILogger<CreatedAppUserConsumer> _logger;

    public CreatedAppUserConsumer(ILogger<CreatedAppUserConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<CreatedAppUser> context)
    {
        // context.P
        /*await context.Message..ReadFromJsonAsync<AuthToken>(_options);
        JsonSerializer.Se*/
        // var hi = context.;
        var data = context.Message;
        var jsonMessage = JsonSerializer.Serialize(data);
        // var jsonMessage = JsonConvert.SerializeObject(context.Message);
        _logger.LogInformation("Message {Message}", jsonMessage);
        Console.WriteLine($"OrderCreated message: {jsonMessage}");
        await Task.CompletedTask;
        //Validate the Ticket Data
        //Store to Database
        //Notify the user via Email / SMS
    }
}