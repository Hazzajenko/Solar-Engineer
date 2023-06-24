using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Notifications;

public sealed record GetUserNotificationsCommand(AuthUser AuthUser) : ICommand<bool>;
