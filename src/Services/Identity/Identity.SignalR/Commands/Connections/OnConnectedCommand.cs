using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Connections;

public sealed record OnConnectedCommand(AuthUser AuthUser) : ICommand<bool>;
