using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Projects;

[Authorize]
public class CreateProjectEndpoint : Endpoint<CreateProjectRequest, OneProjectResponse>
{
    private readonly ILogger<CreateProjectEndpoint> _logger;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public CreateProjectEndpoint(
        ILogger<CreateProjectEndpoint> logger,
        IProjectsService projectsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/projects");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var appUserProject = request.ToAppUserProject(user);

        var projectDto = await _projectsService.CreateProjectAsync(appUserProject);

        var response = new OneProjectResponse
        {
            Project = projectDto
        };

        _logger.LogInformation("{UserName} created a new project {Project}", user.UserName, projectDto.Name);

        await SendOkAsync(response, cancellationToken);
    }
}