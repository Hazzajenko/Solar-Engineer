using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record SendMousePositionCommand(AuthUser User, SendMousePositionRequest Request)
    : ICommand<bool>;
