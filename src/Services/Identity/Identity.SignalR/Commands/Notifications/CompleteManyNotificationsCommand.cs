using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Notifications;

public sealed record CompleteManyNotificationsCommand(
    AuthUser AuthUser,
    IEnumerable<string> NotificationIds
) : ICommand<bool>;
