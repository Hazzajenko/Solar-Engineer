using Infrastructure.Authentication;
using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.Domain.Commands.Projects;

public sealed record CreateProjectCommand(AuthUser User, CreateProjectRequest CreateProjectRequest)
    : ICommand<Guid>;