using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Notifications;

public sealed record DeleteNotificationCommand(AuthUser AuthUser, string NotificationId)
    : ICommand<bool>;
