using Infrastructure.Authentication;
using Projects.Domain.Contracts.Requests.Projects;
using Projects.Domain.Contracts.Responses.Projects;

namespace Projects.Domain.Commands.Projects;

public sealed record InviteToProjectCommand(AuthUser User, InviteToProjectRequest Request)
    : ICommand<InviteToProjectResponse?>;