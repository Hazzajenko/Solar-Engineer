using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Connections.OnDisconnected;

public sealed record OnDisconnectedCommand(AuthUser AuthUser) : ICommand<bool>;