using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Connections.OnConnected;

public sealed record OnConnectedCommand(AuthUser AuthUser) : ICommand<bool>;