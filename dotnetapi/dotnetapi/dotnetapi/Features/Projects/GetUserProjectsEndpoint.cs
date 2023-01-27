using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Projects;

[Authorize]
public class GetUserProjectsEndpoint : EndpointWithoutRequest<ManyProjectsResponse>
{
    private readonly ILogger<GetUserProjectsEndpoint> _logger;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetUserProjectsEndpoint(
        ILogger<GetUserProjectsEndpoint> logger,
        IProjectsService projectsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _projectsService = projectsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/projects");
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

        var projectDtos = await _projectsService.GetAllProjectsByUserIdAsync(user.Id);

        var response = new ManyProjectsResponse
        {
            Projects = projectDtos
        };

        await SendOkAsync(response, cT);
    }
}