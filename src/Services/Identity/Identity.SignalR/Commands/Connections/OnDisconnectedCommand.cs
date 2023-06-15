using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Connections;

public sealed record OnDisconnectedCommand(AuthUser AuthUser) : ICommand<bool>;