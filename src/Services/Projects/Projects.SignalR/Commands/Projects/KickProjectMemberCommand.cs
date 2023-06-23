using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record KickProjectMemberCommand(AuthUser User, KickProjectMemberRequest Request)
    : ICommand<bool>;
