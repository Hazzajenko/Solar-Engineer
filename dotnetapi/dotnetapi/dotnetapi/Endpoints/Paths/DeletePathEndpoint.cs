using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Paths;

[Authorize]
public class DeletePathEndpoint : EndpointWithoutRequest<OneDeleteResponse>
{
    private readonly ILogger<DeletePathEndpoint> _logger;
    private readonly IPathsService _pathsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public DeletePathEndpoint(
        ILogger<DeletePathEndpoint> logger,
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
        Delete("/projects/{projectId:int}/path/{pathId}");
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

        var project = await _projectsService.GetProjectByIdAsync(projectId);
        if (project is null)
        {
            _logger.LogError("Bad request, ProjectId is invalid");
            ThrowError("Bad request, ProjectId is invalid");
        }

        var pathId = Route<string>("pathId");
        if (string.IsNullOrEmpty(pathId)) ThrowError("Invalid pathId");

        var deleted = await _pathsService.DeletePathAsync(pathId);


        var response = new OneDeleteResponse
        {
            Delete = true
        };

        await SendOkAsync(response, cT);
    }
}