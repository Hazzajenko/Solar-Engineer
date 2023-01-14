using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Cache;
using dotnetapi.Services.Links;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Projects;
using dotnetapi.Services.Strings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapi.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly ILogger<ProjectsController> _logger;
    private readonly IPanelLinksService _panelLinksService;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;
    private readonly IStringsService _stringsService;
    private readonly UserManager<AppUser> _userManager;
    private readonly ICacheService _cacheService;


    public ProjectsController(
        ILogger<ProjectsController> logger,
        UserManager<AppUser> userManager,
        ICacheService cacheService,
        IProjectsService projectsService,
        IPanelsService panelsService,
        IStringsService stringsService,
        IPanelLinksService panelLinksService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _cacheService = cacheService;
        _projectsService = projectsService;
        _panelsService = panelsService;
        _stringsService = stringsService;
        _panelLinksService = panelLinksService;
    }


    [HttpPost]
    public async Task<IActionResult> CreateProject(CreateProjectRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var appUserProject = request.ToAppUserProject(user);

        var projectDto = await _projectsService.CreateProjectAsync(appUserProject);
        
        // var expiry
        
        var result = new OneProjectResponse
        {
            Project = projectDto
        };

        return Ok(projectDto);
    }

    [HttpGet("{projectId:int}")]
    public async Task<IActionResult> Get([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var projectDto = await _projectsService.GetProjectByIdAsync(projectId);

        if (projectDto is null) return NotFound();
        var result = new OneProjectResponse
        {
            Project = projectDto
        };

        return Ok(result);
    }

    [HttpGet("{projectId:int}/data")]
    public async Task<IActionResult> GetProjectData([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var projectDto = await _projectsService.GetProjectByIdAsync(projectId);
        if (projectDto is null) return NotFound();
        var stringDtos = await _stringsService.GetAllStringsByProjectIdAsync(projectId);
        var panelDtos = await _panelsService.GetAllPanelsByProjectIdAsync(projectId);
        var panelLinkDtos = await _panelLinksService.GetAllPanelLinksByProjectIdAsync(projectId);

        var result = new ProjectDataResponse
        {
            Project = projectDto,
            Strings = stringDtos,
            Panels = panelDtos,
            Links = panelLinkDtos
        };

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserProjects([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var projectDtos = await _projectsService.GetAllProjectsByUserIdAsync(user.Id);

        var result = new ManyProjectsResponse
        {
            Projects = projectDtos
        };

        return Ok(result);
    }

    [HttpPut("{projectId:int}")]
    public async Task<IActionResult> Update([FromRoute] int projectId, [FromBody] ProjectDto request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var existingProject = await _projectsService.GetProjectByIdAsync(request.Id);

        if (existingProject is null) return NotFound();

        var projectEntity = request.ToEntity();
        var result = await _projectsService.UpdateProjectAsync(projectEntity);

        if (!result) return BadRequest();

        return Ok(request);
    }

    [HttpDelete("{projectId:int}")]
    public async Task<IActionResult> Delete([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var existingProject = await _projectsService.GetProjectByIdAsync(projectId);

        if (existingProject is null) return NotFound();

        var deleted = await _projectsService.DeleteProjectAsync(existingProject.Id);
        if (!deleted) return NotFound();

        return Ok();
    }
}