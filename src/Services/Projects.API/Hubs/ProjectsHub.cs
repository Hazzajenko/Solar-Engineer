using MapsterMapper;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Requests.Panels;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Contracts.Requests.Strings;
using Projects.API.Handlers.SignalR;
using Projects.API.Handlers.SignalR.OnConnected;
using Projects.API.Mapping;
using GetProjectByIdQuery = Projects.API.Handlers.Projects.GetProject.GetProjectByIdQuery;

namespace Projects.API.Hubs;

public class ProjectsHub : Hub<IProjectsHub>
{
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;
    private readonly Dictionary<string, Type> _messageTypes;

    public ProjectsHub(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
        _messageTypes = typeof(Program).Assembly.DefinedTypes
            .Where(x =>
                typeof(ICommand<bool>).IsAssignableFrom(x) && x is { IsInterface: false })
            .ToDictionary(type => type.Name, type => type.AsType());
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


    public async Task GetUserProjects()
    {
        await _mediator.Send(new GetProjectsQuery(Context));
    }

    public async Task GetProjectById(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context.ToHubAppUser(), projectId));
    }

    public async Task GetUserProject(string projectId)
    {
        await _mediator.Send(new Handlers.SignalR.GetProjectByIdQuery(Context, projectId));
    }

    public async Task UpdateProject(UpdateProjectRequest request)
    {
        await _mediator.Send(new UpdateProjectCommand(Context, request));
    }

    /*public async Task CreatePanel(CreateRequest<PanelCreate> request)
    {
        await _mediator.Send(new CreatePanelCommand(Context.AppUser(), request));
    }*/

    public async Task SendProjectEvent(ProjectEvent projectEvent)
    {
        var eventRequest = projectEvent.ToCommandObject(Context);
        await _mediator.Send(eventRequest);
    }

    /*public async Task NewProjectEvent(NewProjectEventRequest request)
    {
        switch (request.Model)
        {
            case ObjectType.Panel:
                switch (request.Action)
                {
                    case EventType.Create:
                        // var typeName = typeof(CreatePanelCommand).Name;
                        // Log.Logger.Information("TypeName: {TypeName}", typeName);
                        var typeName2 = nameof(CreatePanelCommand);
                        Log.Logger.Information("TypeName: {TypeName}", typeName2);
                        // var messageType = "Projects.API.Handlers.Panels.CreatePanel.CreatePanelCommand";
                        var messageType2 = $"Projects.API.Handlers.Panels.CreatePanel.{typeName2}";
                        // Projects.API.Handlers.Panels.CreatePanel;
                        var type = Type.GetType(messageType2);
                        // var type = _messageTypes.GetValueOrDefault(messageType2);
                        if (type is null)
                        {
                            Log.Logger.Error("Could not find type {MessageType}", messageType2);
                            return;
                        }

                        var typedMessage = (ICommand)JsonSerializer.Deserialize(request.Data, type)!;
                        Log.Logger.Information("Sending {@TypedMessage}", typedMessage);
                        await _mediator.Send(typedMessage);
                        // var type = _messageTypes[messageType];
                        // var command = _mapper.Map<CreatePanelCommand>(request, Context);
                        // var command = _mapper.Map<CreatePanelCommand>((request, Context));
                        // var command2 = request.ToCommand<CreatePanelCommand, CreatePanelRequest>(Context);
                        // await _mediator.Send(command2);
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
    }*/

    public async Task CreatePanel(CreatePanelRequest request)
    {
        // await _mediator.Send(new CreatePanelCommand(Context.AppUser(), request));
    }

    /*public async Task UpdatePanel(UpdatePanelRequest request)
    {
        await _mediator.Send(new UpdatePanelCommand(Context.AppUser(), request));
    }*/

    public async Task CreateString(CreateStringRequest request)
    {
        // await _mediator.Send(new CreateStringCommand(Context.AppUser(), request));
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