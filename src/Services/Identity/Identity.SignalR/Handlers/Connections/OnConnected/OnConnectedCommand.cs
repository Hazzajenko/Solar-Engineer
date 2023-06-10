using Infrastructure.Authentication;
using Infrastructure.SignalR;
using Mediator;

namespace Identity.SignalR.Handlers.Connections.OnConnected;

public sealed record OnConnectedCommand(AuthUser AuthUser) : ICommand<bool>;