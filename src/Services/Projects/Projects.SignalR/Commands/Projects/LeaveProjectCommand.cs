using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record LeaveProjectCommand(AuthUser User, LeaveProjectRequest LeaveProjectRequest)
    : ICommand<bool>;
