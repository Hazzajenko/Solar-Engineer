using Infrastructure.Authentication;
using Mediator;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Handlers.Projects.InviteToProject;

public sealed record InviteToProjectCommand(AuthUser User, InviteToProjectRequest Request)
    : ICommand<bool>;