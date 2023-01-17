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
public class UpdateManyPanelsEndpoint : Endpoint<UpdateManyPanelsRequest, ManyPanelsUpdatesResponse>
{
    private readonly ILogger<UpdateManyPanelsEndpoint> _logger;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public UpdateManyPanelsEndpoint(
        ILogger<UpdateManyPanelsEndpoint> logger,
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
        Put("projects/{projectId:int}/panels");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdateManyPanelsRequest request, CancellationToken ct)
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

        var updates = await _panelsService.UpdateManyPanelsAsync(request);

        var successfulUpdates = 0;
        var errors = 0;
        foreach (var update in updates)
            if (!update)
                errors++;
            else
                successfulUpdates++;


        var response = new ManyPanelsUpdatesResponse
        {
            SuccessfulUpdates = successfulUpdates,
            Errors = errors
        };

        await SendOkAsync(response, ct);
    }
}