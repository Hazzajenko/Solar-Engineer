using EventBus.Domain.AppUserEvents.Responses;
using Infrastructure.Logging;
using Wolverine;

namespace Identity.Application.Events;

public static class UserCreatedHandler
{
    public static ValueTask Handle(UserCreated message, IMessageContext context)
    {
        message.DumpObjectJson();

        // return context.RespondToSenderAsync("Hello from the other side");
        return ValueTask.CompletedTask;
    }
}