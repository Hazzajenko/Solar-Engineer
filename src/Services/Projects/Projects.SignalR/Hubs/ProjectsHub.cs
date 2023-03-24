// using Projects.API.Handlers;

using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Projects.Domain.Commands.Projects;
using Projects.Domain.Contracts.Requests.Projects;
using Projects.Domain.Queries.Projects;
using Projects.SignalR.Mapping;
using Serilog;

namespace Projects.SignalR.Hubs;

public class ProjectsHub : Hub<IProjectsHub>
{
    private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    // private readonly Dictionary<string, Type> _messageTypes;

    public ProjectsHub(IMediator mediator, IMapper mapper)
    {
        _mediator = mediator;
        _mapper = mapper;
        /*_messageTypes = typeof(Program).Assembly.DefinedTypes
            .Where(x => typeof(ICommand<bool>).IsAssignableFrom(x) && x is { IsInterface: false })
            .ToDictionary(type => type.Name, type => type.AsType());*/
    }

    public override async Task OnConnectedAsync()
    {
        // await _mediator.Send(new OnConnectedCommand(Context.ToHubAppUser()));
        // Connections.Add(Context.ToHubAppUser().Id.ToString(), Context.ConnectionId);
        // Connections.DumpObjectJson();
        Log.Logger.Information("Connected: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        Log.Logger.Information("Disconnected: {ConnectionId}", Context.ConnectionId);
        // Connections.Remove(Context.ToHubAppUser().Id.ToString(), Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task CreateProject(CreateProjectRequest request)
    {
        var command = new CreateProjectCommand(Context.ToHubAppUser(), request);
        await _mediator.Send(command);
    }

    public async Task DeleteProject(DeleteProjectRequest request)
    {
        var command = new DeleteProjectCommand(Context.ToHubAppUser(), request);
        await _mediator.Send(command);
    }

    public async Task GetUserProjects()
    {
        await _mediator.Send(new GetUserProjectsQuery(Context.ToHubAppUser()));
    }

    public async Task GetProjectById(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context.ToHubAppUser(), projectId));
    }

    public async Task SendProjectEvent(ProjectEvent projectEvent)
    {
        var eventRequest = projectEvent.ToCommandObject(Context);
        await _mediator.Send(eventRequest);
    }
}