using Infrastructure.Authentication;
using Infrastructure.SignalR;
using Mediator;

namespace Identity.SignalR.Handlers.Connections.OnDisconnected;

public sealed record OnDisconnectedCommand(AuthUser AuthUser) : ICommand<bool>;