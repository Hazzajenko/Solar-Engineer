using Infrastructure.SignalR;
using Mediator;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Handlers.Projects.DeleteProject;

public sealed record DeleteProjectCommand(
    HubAppUser User,
    DeleteProjectRequest DeleteProjectRequest
) : ICommand<bool>;