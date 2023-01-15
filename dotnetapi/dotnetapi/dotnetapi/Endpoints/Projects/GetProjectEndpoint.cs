using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Projects;

[Authorize]
public class GetProjectEndpoint : EndpointWithoutRequest<OneProjectResponse>
{
    private readonly ILogger<GetProjectEndpoint> _logger;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetProjectEndpoint(
        ILogger<GetProjectEndpoint> logger,
        IProjectsService projectsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/projects/{projectId:int}");
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

        var projectDto = await _projectsService.GetProjectByIdAsync(projectId);

        if (projectDto is null)
        {
            await SendNotFoundAsync(cT);
            return;
        }

        var response = new OneProjectResponse
        {
            Project = projectDto
        };

        await SendOkAsync(response, cT);
    }
}