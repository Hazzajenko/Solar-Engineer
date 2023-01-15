using dotnetapi.Contracts.Requests.Projects;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Projects;

[Authorize]
public class UpdateProjectEndpoint : Endpoint<UpdateProjectRequest, OneUpdateResponse>
{
    private readonly ILogger<UpdateProjectEndpoint> _logger;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public UpdateProjectEndpoint(
        ILogger<UpdateProjectEndpoint> logger,
        IProjectsService projectsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Put("/projects/{projectId:int}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdateProjectRequest request, CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var existingProject = await _projectsService.GetProjectByIdAsync(request.Id);

        if (existingProject is null)
        {
            await SendNotFoundAsync(cT);
            return;
        }

        var projectEntity = existingProject.ToEntity();
        var result = await _projectsService.UpdateProjectAsync(projectEntity);

        var response = new OneUpdateResponse
        {
            Update = true
        };

        await SendOkAsync(response, cT);
    }
}