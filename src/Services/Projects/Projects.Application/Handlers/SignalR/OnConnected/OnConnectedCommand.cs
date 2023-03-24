using Infrastructure.SignalR;
using Mediator;

namespace Projects.Application.Handlers.SignalR.OnConnected;

public sealed record OnConnectedCommand(HubAppUser User) : ICommand<bool>;