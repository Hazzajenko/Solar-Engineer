// using System.IdentityModel.Tokens.Jwt;

using System.Text.Json;
using Infrastructure.Entities;

namespace Auth.API.Events;

public class TicketConsumer : IConsumer<Ticket>
{
    private readonly ILogger<TicketConsumer> _logger;

    public TicketConsumer(ILogger<TicketConsumer> logger)
    {
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<Ticket> context)
    {
        // context.P
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