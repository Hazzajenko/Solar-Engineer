using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Panels;

[Authorize]
public class GetPanelsEndpoint : EndpointWithoutRequest<ManyPanelsResponse>
{
    private readonly ILogger<GetPanelsEndpoint> _logger;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetPanelsEndpoint(
        ILogger<GetPanelsEndpoint> logger,
        IPanelsService panelsService,
        UserManager<AppUser> userManager,
        IProjectsService projectsService)
    {
        _logger = logger;
        _panelsService = panelsService;
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
            ThrowError("UserName is invalid");
        }

        var projectId = Route<int>("projectId");
        if (projectId < 0) ThrowError("Invalid project Id");

        var project = await _projectsService.GetProjectByIdAsync(projectId);
        if (project is null)
        {
            _logger.LogError("Bad request, ProjectId is invalid");
            ThrowError("Bad request, ProjectId is invalid");
        }

        var panelList = await _panelsService.GetAllPanelsByProjectIdAsync(projectId);

        var response = new ManyPanelsResponse
        {
            Panels = panelList
        };

        await SendOkAsync(response, ct);
    }
}