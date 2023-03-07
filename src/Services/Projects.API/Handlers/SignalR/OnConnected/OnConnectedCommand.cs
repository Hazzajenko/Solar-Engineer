using Infrastructure.SignalR;
using Mediator;

namespace Projects.API.Handlers.SignalR.OnConnected;

public sealed record OnConnectedCommand(HubAppUser User) : ICommand<bool>;