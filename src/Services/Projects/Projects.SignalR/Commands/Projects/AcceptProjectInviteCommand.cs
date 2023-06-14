using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record AcceptProjectInviteCommand(AuthUser User, AcceptProjectInviteRequest Request)
    : ICommand<bool>;
