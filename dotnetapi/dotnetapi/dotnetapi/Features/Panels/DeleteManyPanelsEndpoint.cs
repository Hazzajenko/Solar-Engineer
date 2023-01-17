using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Panels;

[Authorize]
public class DeleteManyPanelsEndpoint : Endpoint<DeleteManyPanelsRequest, ManyPanelsDeletesResponse>
{
    private readonly ILogger<DeleteManyPanelsEndpoint> _logger;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public DeleteManyPanelsEndpoint(
        ILogger<DeleteManyPanelsEndpoint> logger,
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
        Delete("projects/{projectId:int}/panels");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(DeleteManyPanelsRequest request, CancellationToken ct)
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

        var deletes = await _panelsService.DeleteManyPanelsAsync(request);

        var successfulDeletes = 0;
        var errors = 0;
        foreach (var del in deletes)
            if (!del)
                errors++;
            else
                successfulDeletes++;


        var response = new ManyPanelsDeletesResponse
        {
            SuccessfulDeletes = successfulDeletes,
            Errors = errors
        };

        await SendOkAsync(response, ct);
    }
}