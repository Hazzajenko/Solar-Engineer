using Infrastructure.SignalR;
using Mediator;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Handlers.Projects.CreateProject;

public sealed record CreateProjectCommand(
    HubAppUser User,
    CreateProjectRequest CreateProjectRequest
) : ICommand<bool>;