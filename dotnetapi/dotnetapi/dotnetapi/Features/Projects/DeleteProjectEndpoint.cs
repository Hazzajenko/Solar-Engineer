using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Projects;

[Authorize]
public class DeleteProjectEndpoint : EndpointWithoutRequest<OneDeleteResponse>
{
    private readonly ILogger<DeleteProjectEndpoint> _logger;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public DeleteProjectEndpoint(
        ILogger<DeleteProjectEndpoint> logger,
        IProjectsService projectsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Delete("/projects/{projectId:int}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var projectId = Route<int>("projectId");
        if (projectId < 0) ThrowError("Invalid project Id");

        var existingProject = await _projectsService.GetProjectByIdAsync(projectId);

        if (existingProject is null)
        {
            await SendNotFoundAsync(cT);
            return;
        }

        var deleted = await _projectsService.DeleteProjectAsync(existingProject.Id);
        // if (!deleted) return NotFound();
        var response = new OneDeleteResponse
        {
            Delete = true
        };

        _logger.LogInformation("{UserName} deleted project {Project}", user.UserName, projectId.ToString());

        await SendOkAsync(response, cT);
    }
}