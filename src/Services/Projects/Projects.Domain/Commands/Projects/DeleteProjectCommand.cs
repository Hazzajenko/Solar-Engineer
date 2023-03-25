using Infrastructure.Authentication;
using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.Domain.Commands.Projects;

public sealed record DeleteProjectCommand(AuthUser User, DeleteProjectRequest DeleteProjectRequest)
    : ICommand<bool>;