using Infrastructure.Authentication;
using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.Domain.Commands.Projects;

public sealed record UpdateProjectCommand(AuthUser User, UpdateProjectRequest UpdateProjectRequest)
    : ICommand<bool>;

/*public sealed record UpdateProjectCommand(
    HubCallerContext Context,
    UpdateProjectRequest UpdateProjectRequest
) : IRequest<bool>;*/