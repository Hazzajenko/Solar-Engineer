using System.Text.Json;
using Infrastructure.Extensions;
using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests.Panels;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Contracts.Requests.Strings;
using Projects.API.Handlers.Panels.CreatePanel;
using Projects.API.Handlers.Panels.UpdatePanel;
using Projects.API.Handlers.Projects.GetProject;
using Projects.API.Handlers.SignalR;
using Projects.API.Handlers.SignalR.OnConnected;
using Projects.API.Handlers.Strings.CreateString;
using Projects.API.Mapping;
using Serilog;

namespace Projects.API.Hubs;

public class ProjectsHub : Hub<IProjectsHub>
{
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    public ProjectsHub(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
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

    public async Task NewProjectEvent(NewProjectEventRequest request)
    {
        switch (request.Model)
        {
            case ObjectType.Panel:
                switch (request.Action)
                {
                    case EventType.Create:
                        // var command = _mapper.Map<CreatePanelCommand>(request, Context);
                        // var command = _mapper.Map<CreatePanelCommand>((request, Context));
                        var command2 = request.ToCommand<CreatePanelCommand, CreatePanelRequest>(Context);
                        await _mediator.Send(command2);
                        break;
                    case EventType.Update:
                        await _mediator.Send(
                            new UpdatePanelCommand(
                                Context.AppUser(),
                                JsonSerializer.Deserialize<UpdatePanelRequest>(request.Data)
                                ?? throw new InvalidOperationException()
                            )
                        );
                        break;
                }

                break;
            case ObjectType.String:
                switch (request.Action)
                {
                    case EventType.Create:
                        await _mediator.Send(
                            new CreateStringCommand(
                                Context.AppUser(),
                                JsonSerializer.Deserialize<CreateStringRequest>(request.Data)
                                ?? throw new InvalidOperationException()
                            )
                        );
                        break;
                }

                break;
        }

        Log.Logger.Information("NewProjectEvent called {@Request}", request);
        await Task.CompletedTask;
        // await _mediator.Send(new CreatePanelCommand(Context.AppUser(), request));
    }

    public async Task CreatePanel(CreatePanelRequest request)
    {
        // await _mediator.Send(new CreatePanelCommand(Context.AppUser(), request));
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