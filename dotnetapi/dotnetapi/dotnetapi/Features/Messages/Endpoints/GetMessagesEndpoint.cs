using dotnetapi.Contracts.Responses;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class GetMessagesEndpoint : EndpointWithoutRequest<ManyPanelsResponse>
{
    private readonly ILogger<GetMessagesEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetMessagesEndpoint(
        ILogger<GetMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        UserManager<AppUser> userManager,
        IProjectsService projectsService)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _userManager = userManager;
        _projectsService = projectsService;
    }

    public override void Configure()
    {
        Get("projects/{projectId:int}/panels");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var projectId = Route<int>("projectId");
        if (projectId < 0) ThrowError("Invalid project Id");

        var project = await _projectsService.GetProjectByIdAsync(projectId);
        if (project is null)
        {
            _logger.LogError("Bad request, ProjectId is invalid");
            ThrowError("Bad request, ProjectId is invalid");
        }

        // // var panelList = await _panelsService.GetAllPanelsByProjectIdAsync(projectId);
        //
        // var response = new ManyPanelsResponse
        // {
        //     Panels = panelList
        // };

        // await SendOkAsync(response, ct);
    }
}