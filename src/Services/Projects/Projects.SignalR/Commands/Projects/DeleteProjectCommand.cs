using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record DeleteProjectCommand(AuthUser User, DeleteProjectRequest DeleteProjectRequest)
    : ICommand<bool>;