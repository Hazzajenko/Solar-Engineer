using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Notifications;

public record ReceiveNotificationCommand(AuthUser AuthUser, string NotificationId) : ICommand<bool>;
