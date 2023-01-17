using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Links;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.PanelLinks;

[Authorize]
public class DeletePanelLinkEndpoint : EndpointWithoutRequest<OneDeleteResponse>
{
    private readonly ILogger<DeletePanelLinkEndpoint> _logger;
    private readonly IPanelLinksService _panelLinksService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public DeletePanelLinkEndpoint(
        ILogger<DeletePanelLinkEndpoint> logger,
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
        Delete("/projects/{projectId:int}/link/{linkId}");
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

        var panelLinkId = Route<string>("panelLinkId");
        if (string.IsNullOrEmpty(panelLinkId)) ThrowError("Invalid panelLinkId");

        var deleted = await _panelLinksService.DeletePanelLinkAsync(panelLinkId);

        var response = new OneDeleteResponse
        {
            Delete = true
        };

        await SendOkAsync(response, cT);
    }
}