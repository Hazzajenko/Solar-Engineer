using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Panels;

[Authorize]
public class CreateManyPanelsEndpoint : Endpoint<CreateManyPanelsRequest, CreateManyPanelsResponse>
{
    private readonly ILogger<CreateManyPanelsEndpoint> _logger;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public CreateManyPanelsEndpoint(
        ILogger<CreateManyPanelsEndpoint> logger,
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
        Post("projects/{projectId:int}/panels");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateManyPanelsRequest request, CancellationToken cT)
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

        var panelEntities = request.Panels.Select(x => x.ToEntity(user));

        var amountOfCreates = await _panelsService.CreateManyPanelsAsync(panelEntities, projectId, request.StringId);

        var response = new CreateManyPanelsResponse
        {
            AmountOfCreates = amountOfCreates
        };


        await SendOkAsync(response, cT);
    }
}