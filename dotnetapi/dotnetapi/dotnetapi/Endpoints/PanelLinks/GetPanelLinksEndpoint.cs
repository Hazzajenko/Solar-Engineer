using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Links;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.PanelLinks;

[Authorize]
public class GetPanelLinksEndpoint : EndpointWithoutRequest<ManyPanelLinksResponse>
{
    private readonly ILogger<GetPanelLinksEndpoint> _logger;
    private readonly IPanelLinksService _panelLinksService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetPanelLinksEndpoint(
        ILogger<GetPanelLinksEndpoint> logger,
        IProjectsService projectsService,
        IPanelLinksService panelLinksService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _panelLinksService = panelLinksService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/projects/{projectId:int}/links");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
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

        var panelLinksList = await _panelLinksService.GetAllPanelLinksByProjectIdAsync(projectId);

        var response = new ManyPanelLinksResponse
        {
            Links = panelLinksList
        };

        await SendOkAsync(response, cT);
    }
}