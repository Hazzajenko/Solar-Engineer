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

    public async Task GetUserProjects()
    {
        await _mediator.Send(new GetProjectsQuery(Context));
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