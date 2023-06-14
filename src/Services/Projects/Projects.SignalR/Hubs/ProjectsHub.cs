// using Projects.API.Handlers;

using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Projects.Contracts.Requests.Projects;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Mapping;
using Projects.SignalR.Queries.Projects;

namespace Projects.SignalR.Hubs;

public class ProjectsHub : Hub<IProjectsHub>
{
    private readonly ILogger<ProjectsHub> _logger;
    private readonly IMediator _mediator;

    public ProjectsHub(IMediator mediator, ILogger<ProjectsHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var user = Context.ToAuthUser();
        _logger.LogInformation(
            "Connected: {ConnectionId} - {UserId} - {UserName}",
            Context.ConnectionId,
            user.Id,
            user.UserName
        );
        await GetUserProjects();
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = Context.ToAuthUser();
        _logger.LogInformation(
            "Disconnected: {ConnectionId} - {UserId} - {UserName}",
            Context.ConnectionId,
            user.Id,
            user.UserName
        );
        await base.OnDisconnectedAsync(exception);
    }

    public async Task CreateProject(CreateProjectRequest request)
    {
        var command = new CreateProjectCommand(Context.ToAuthUser(), request);
        await _mediator.Send(command);
    }

    public async Task UpdateProject(UpdateProjectRequest request)
    {
        var command = new UpdateProjectCommand(Context.ToAuthUser(), request);
        await _mediator.Send(command);
    }

    public async Task DeleteProject(DeleteProjectRequest request)
    {
        var command = new DeleteProjectCommand(Context.ToAuthUser(), request);
        await _mediator.Send(command);
    }

    public async Task GetUserProjects()
    {
        await _mediator.Send(new GetUserProjectsQuery(Context.ToAuthUser()));
    }

    public async Task SelectProject(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context.ToAuthUser(), projectId));
    }

    public async Task GetProjectById(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context.ToAuthUser(), projectId));
    }

    public async Task InviteUsersToProject(InviteUserToProjectRequest request)
    {
        var command = new InviteUsersToProjectCommand(Context.ToAuthUser(), request);
        await _mediator.Send(command);
    }

    public async Task AcceptProjectInvite(AcceptProjectInviteRequest request)
    {
        var command = new AcceptProjectInviteCommand(Context.ToAuthUser(), request);
        await _mediator.Send(command);
    }

    public async Task RejectProjectInvite(RejectProjectInviteRequest request)
    {
        var command = new RejectProjectInviteCommand(Context.ToAuthUser(), request);
        await _mediator.Send(command);
    }

    public async Task SendProjectEvent(ProjectGridEvent projectGridEvent)
    {
        projectGridEvent.DumpObjectJson();
        var eventRequest = projectGridEvent.ToCommandObject(Context);
        await _mediator.Send(eventRequest);
    }
}
