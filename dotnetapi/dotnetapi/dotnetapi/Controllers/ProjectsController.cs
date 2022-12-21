using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Services;
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
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;


    public ProjectsController(
        ILogger<ProjectsController> logger,
        UserManager<AppUser> userManager,
        IProjectsService projectsService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _projectsService = projectsService;
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
        var result = new OneProjectResponse
        {
            Project = projectDto
        };

        return Ok(result);
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