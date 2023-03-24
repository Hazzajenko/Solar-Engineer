using EventBus.Domain.AppUserEvents;
using Infrastructure.Logging;
using Wolverine;

namespace Projects.API;

public static class AppUserEventHandler
{
    // Simple message handler for the PingMessage message type
    public static ValueTask Handle(
        // The first argument is assumed to be the message type
        AppUserEvent message,
        // Wolverine supports method injection similar to ASP.Net Core MVC
        // In this case though, IMessageContext is scoped to the message
        // being handled
        IMessageContext context
    )
    {
        message.DumpObjectJson();
        // var type = message.AppUserEventType;
        // var typeString = type.ToString();
        // Log.Logger.Information("AppUserEvent type: {Type}", typeString);
        // AnsiConsole.Write($"[blue]Got ping #{message.User}[/]");

        var response = new AppUserEventResponse(message.AppUserEventType, "Pong");

        // This usage will send the response message
        // back to the original sender. Wolverine uses message
        // headers to embed the reply address for exactly
        // this use case
        return context.RespondToSenderAsync(response);
    }
}