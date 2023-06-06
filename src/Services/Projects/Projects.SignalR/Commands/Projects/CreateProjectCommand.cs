using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record CreateProjectCommand(AuthUser User, CreateProjectRequest CreateProjectRequest)
    : ICommand<Guid>;