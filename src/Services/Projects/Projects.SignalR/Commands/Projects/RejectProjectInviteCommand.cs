using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record RejectProjectInviteCommand(AuthUser User, RejectProjectInviteRequest Request)
    : ICommand<bool>;
