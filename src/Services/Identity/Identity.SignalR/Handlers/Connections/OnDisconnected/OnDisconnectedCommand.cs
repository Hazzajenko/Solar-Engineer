using Infrastructure.SignalR;
using Mediator;

namespace Identity.SignalR.Handlers.Connections.OnDisconnected;

public sealed record OnDisconnectedCommand(HubAppUser User) : ICommand<bool>;