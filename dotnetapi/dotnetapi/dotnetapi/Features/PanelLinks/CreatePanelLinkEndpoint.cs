using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Links;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.PanelLinks;

[Authorize]
public class CreatePanelLinkEndpoint : Endpoint<CreatePanelLinkRequest, OnePanelLinkResponse>
{
    private readonly ILogger<CreatePanelLinkEndpoint> _logger;
    private readonly IPanelLinksService _panelLinksService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public CreatePanelLinkEndpoint(
        ILogger<CreatePanelLinkEndpoint> logger,
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
        Post("/projects/{projectId:int}/link");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreatePanelLinkRequest request, CancellationToken cancellationToken)
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

        var panelLinkEntity = request.ToEntity();
        panelLinkEntity.ProjectId = projectId;

        var panelLinkDto = await _panelLinksService.CreatePanelLinkAsync(panelLinkEntity);

        var response = new OnePanelLinkResponse
        {
            Link = panelLinkDto
        };

        await SendOkAsync(response, cancellationToken);
    }
}