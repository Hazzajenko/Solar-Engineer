using Infrastructure.SignalR;
using Mediator;

namespace Identity.SignalR.Handlers.Connections.OnConnected;

public sealed record OnConnectedCommand(HubAppUser User) : ICommand<bool>;