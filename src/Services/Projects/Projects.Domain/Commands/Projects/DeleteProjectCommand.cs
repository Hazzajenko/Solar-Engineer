using Infrastructure.SignalR;
using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.Domain.Commands.Projects;

public sealed record DeleteProjectCommand(
    HubAppUser User,
    DeleteProjectRequest DeleteProjectRequest
) : ICommand<bool>;