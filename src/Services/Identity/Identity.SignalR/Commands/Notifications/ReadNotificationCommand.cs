using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Notifications;

public sealed record ReadNotificationCommand(AuthUser AuthUser, string NotificationId)
    : ICommand<bool>;
