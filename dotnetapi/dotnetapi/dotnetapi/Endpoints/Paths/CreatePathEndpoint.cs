using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Contracts.Responses.Paths;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Paths;

[Authorize]
public class CreatePathEndpoint : Endpoint<CreatePathRequest, PathResponse>
{
    private readonly ILogger<CreatePathEndpoint> _logger;
    private readonly IPathsService _pathsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public CreatePathEndpoint(
        ILogger<CreatePathEndpoint> logger,
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
        Post("/projects/{projectId:int}/path");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreatePathRequest request, CancellationToken cancellationToken)
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

        var pathEntity = request.ToEntity();

        var pathDto = await _pathsService.CreatePathAsync(pathEntity, projectId);

        var response = new PathResponse
        {
            Path = pathDto
        };

        await SendOkAsync(response, cancellationToken);
    }
}