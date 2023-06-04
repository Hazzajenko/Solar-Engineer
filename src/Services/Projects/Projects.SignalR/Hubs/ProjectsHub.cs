// using Projects.API.Handlers;

using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Projects.Domain.Commands.Projects;
using Projects.Domain.Contracts.Requests.Projects;
using Projects.Domain.Queries.Projects;
using Projects.SignalR.Mapping;

namespace Projects.SignalR.Hubs;

public class ProjectsHub : Hub<IProjectsHub>
{
    private readonly ILogger<ProjectsHub> _logger;

    // private readonly IMapper _mapper;
    private readonly IMediator _mediator;

    // private readonly Dictionary<string, Type> _messageTypes;

    public ProjectsHub(IMediator mediator, ILogger<ProjectsHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
        /*_messageTypes = typeof(Program).Assembly.DefinedTypes
            .Where(x => typeof(ICommand<bool>).IsAssignableFrom(x) && x is { IsInterface: false })
            .ToDictionary(type => type.Name, type => type.AsType());*/
    }

    public override async Task OnConnectedAsync()
    {
        // await _mediator.Send(new OnConnectedCommand(Context.ToHubAppUser()));
        // Connections.Add(Context.ToHubAppUser().Id.ToString(), Context.ConnectionId);
        // Connections.DumpObjectJson();
        var user = Context.ToAuthUser();
        _logger.LogInformation(
            "Connected: {ConnectionId} - {UserId}",
            Context.ConnectionId,
            user.Id
        );
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = Context.ToAuthUser();
        _logger.LogInformation(
            "Disconnected: {ConnectionId} - {UserId}",
            Context.ConnectionId,
            user.Id
        );

        // _logger.LogInformation("Disconnected: {ConnectionId}", Context.ConnectionId);
        // Connections.Remove(Context.ToHubAppUser().Id.ToString(), Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task CreateProject(CreateProjectRequest request)
    {
        var command = new CreateProjectCommand(Context.ToAuthUser(), request);
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

    public async Task GetProjectById(string projectId)
    {
        await _mediator.Send(new GetProjectByIdQuery(Context.ToAuthUser(), projectId));
    }

    public async Task SendProjectEvent(ProjectGridEvent projectGridEvent)
    {
        projectGridEvent.DumpObjectJson();
        var eventRequest = projectGridEvent.ToCommandObject(Context);
        await _mediator.Send(eventRequest);
    }
}