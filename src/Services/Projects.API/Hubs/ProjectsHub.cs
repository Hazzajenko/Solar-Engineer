using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Requests;
using Projects.API.Handlers.SignalR;

namespace Projects.API.Hubs;

public class ProjectsHub : Hub<IProjectsHub>
{
    private readonly IMediator _mediator;

    public ProjectsHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override async Task OnConnectedAsync()
    {
        await _mediator.Send(new OnConnectedAsyncCommand(Context));

        await base.OnConnectedAsync();
    }

    public async Task GetProjects()
    {
        await _mediator.Send(new GetProjectsQuery(Context));
    }

    public async Task GetUserProject(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context, projectId));
    }

    public async Task UpdateProject(UpdateProjectRequest request)
    {
        await _mediator.Send(new UpdateProjectCommand(Context, request));
    }

    /*
    public override async Task OnConnectedAsync()
    {
        await _mediator.Send(new OnConnectedAsyncCommand(Context));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _mediator.Send(new OnDisconnectedAsyncCommand(Context));

        await base.OnDisconnectedAsync(exception);
    }*/
}