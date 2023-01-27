using dotnetapi.Contracts.Responses.Paths;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Paths;

[Authorize]
public class GetPathsEndpoint : EndpointWithoutRequest<ManyPathsResponse>
{
    private readonly ILogger<GetPathsEndpoint> _logger;
    private readonly IPathsService _pathsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetPathsEndpoint(
        ILogger<GetPathsEndpoint> logger,
        IProjectsService projectsService,
        IPathsService pathsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _pathsService = pathsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/projects/{projectId:int}/paths");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
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

        var pathsList = await _pathsService.GetAllPathsByProjectIdAsync(projectId);

        var response = new ManyPathsResponse
        {
            Paths = pathsList
        };

        await SendOkAsync(response, cancellationToken);
    }
}