using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record UpdateProjectCommand(AuthUser User, UpdateProjectRequest UpdateProjectRequest)
    : ICommand<bool>;

/*public sealed record UpdateProjectCommand(
    HubCallerContext Context,
    UpdateProjectRequest UpdateProjectRequest
) : IRequest<bool>;*/