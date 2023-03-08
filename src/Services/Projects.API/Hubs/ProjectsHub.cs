using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Requests.Panels;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Contracts.Requests.Strings;
using Projects.API.Handlers.Panels.CreatePanel;
using Projects.API.Handlers.Panels.UpdatePanel;
using Projects.API.Handlers.Projects.GetProject;
using Projects.API.Handlers.SignalR;
using Projects.API.Handlers.SignalR.OnConnected;
using Projects.API.Handlers.Strings.CreateString;

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
        await _mediator.Send(new OnConnectedCommand(Context.ToHubAppUser()));
        await base.OnConnectedAsync();
    }
    /*public override async Task OnDisconnectedAsync(bool stopCalled)
    {
        return base.OnDisconnectedAsync(stopCalled);
    }*/


    public async Task GetManyProjects()
    {
        await _mediator.Send(new GetProjectsQuery(Context));
    }

    public async Task GetProject(string projectId)
    {
        await _mediator.Send(new GetProjectQuery(Context.ToHubAppUser(), projectId));
    }

    public async Task GetUserProject(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context, projectId));
    }

    public async Task UpdateProject(UpdateProjectRequest request)
    {
        await _mediator.Send(new UpdateProjectCommand(Context, request));
    }

    /*public async Task CreatePanel(CreateRequest<PanelCreate> request)
    {
        await _mediator.Send(new CreatePanelCommand(Context.AppUser(), request));
    }*/

    public async Task CreatePanel(CreatePanelRequest request)
    {
        await _mediator.Send(new CreatePanelCommand(Context.AppUser(), request));
    }

    public async Task UpdatePanel(UpdatePanelRequest request)
    {
        await _mediator.Send(new UpdatePanelCommand(Context.AppUser(), request));
    }

    public async Task CreateString(CreateStringRequest request)
    {
        await _mediator.Send(new CreateStringCommand(Context.AppUser(), request));
    }

    public async Task CreateProjectItem(UpdateProjectRequest request)
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