using dotnetapi.Contracts.Requests.Panels;
using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Panels;

[Authorize]
public class DeletePanelEndpoint : Endpoint<UpdatePanelRequest, OneDeleteResponse>
{
    private readonly ILogger<DeletePanelEndpoint> _logger;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public DeletePanelEndpoint(
        ILogger<DeletePanelEndpoint> logger,
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
        Delete("projects/{projectId:int}/panel/{panelId}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdatePanelRequest request, CancellationToken ct)
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

        var panelId = Route<string>("panelId");
        if (string.IsNullOrEmpty(panelId)) ThrowError("Invalid panelId");

        var deleted = await _panelsService.DeletePanelAsync(panelId);

        var response = new OneDeleteResponse
        {
            Delete = true
        };

        await SendOkAsync(response, ct);
    }
}