using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Paths;

[Authorize]
public class UpdatePathEndpoint : Endpoint<UpdatePathRequest, OneUpdateResponse>
{
    private readonly ILogger<UpdatePathEndpoint> _logger;
    private readonly IPathsService _pathsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public UpdatePathEndpoint(
        ILogger<UpdatePathEndpoint> logger,
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
        Put("/projects/{projectId:int}/path/{pathId}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdatePathRequest request, CancellationToken cancellationToken)
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

        var update = await _pathsService.UpdatePathAsync(request);

        var response = new OneUpdateResponse
        {
            Update = true
        };

        await SendOkAsync(response, cancellationToken);
    }
}