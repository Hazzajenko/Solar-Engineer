using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;

namespace Projects.SignalR.Commands.Projects;

public sealed record CreateProjectCommand(AuthUser User, CreateProjectRequest CreateProjectRequest)
    : ICommand<ProjectCreatedWithTemplateResponse>;
