using EventBus.Domain.AppUserEvents;
using Infrastructure.Logging;

namespace Identity.Application;

// Simple message handler for the PongMessage responses
// The "Handler" suffix is important as a naming convention
// to let Wolverine know that it should build a message handling
// pipeline around public methods on this class
public static class AppUserEventResponseHandler
{
    // "Handle" is recognized by Wolverine as a message handling
    // method. Handler methods can be static or instance methods
    public static void Handle(AppUserEventResponse message)
    {
        // AnsiConsole.Write($"[blue]Got pong #{message.Message}[/]");
        message.DumpObjectJson();
    }
}