using Infrastructure.SignalR;
using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.Domain.Commands.Projects;

public sealed record CreateProjectCommand(
    HubAppUser User,
    CreateProjectRequest CreateProjectRequest
) : ICommand<bool>;