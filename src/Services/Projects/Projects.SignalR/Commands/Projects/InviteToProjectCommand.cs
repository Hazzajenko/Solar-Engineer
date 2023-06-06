using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record InviteToProjectCommand(AuthUser User, InviteToProjectRequest Request)
    : ICommand<InviteToProjectResponse?>;