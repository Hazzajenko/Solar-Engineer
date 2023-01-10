using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Contracts.Responses.Paths;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Paths;
using dotnetapi.Services.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapi.Controllers;

[Route("projects/{projectId:int}")]
[ApiController]
public class PathsController : ControllerBase
{
    private readonly ILogger<PathsController> _logger;
    private readonly IPathsService _pathsService;

    private readonly IProjectsService _projectsService;

    private readonly UserManager<AppUser> _userManager;


    public PathsController(
        ILogger<PathsController> logger,
        UserManager<AppUser> userManager,
        IPathsService pathsService,
        IProjectsService projectsService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _pathsService = pathsService;

        _projectsService = projectsService;
    }


    [HttpPost("path")]
    [Authorize]
    public async Task<IActionResult> CreatePath([FromBody] CreatePathRequest request, [FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var project = _projectsService.GetProjectByIdAsync(projectId);
        if (project.Result == null)
        {
            _logger.LogError("Bad request, Project from route is invalid");
            return BadRequest("Bad request, Project from route is invalid");
        }

        var pathEntity = request.ToEntity();

        var pathDto = await _pathsService.CreatePathAsync(pathEntity, projectId);

        var result = new PathResponse
        {
            Path = pathDto
        };

        return Ok(result);
    }


    [HttpGet("paths")]
    public async Task<IActionResult> GetPathsByProjectId([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var project = _projectsService.GetProjectByIdAsync(projectId);
        if (project.Result == null)
        {
            _logger.LogError("Bad request, Project from route is invalid");
            return BadRequest("Bad request, Project from route is invalid");
        }

        var pathsList = await _pathsService.GetAllPathsByProjectIdAsync(projectId);

        var result = new ManyPathsResponse
        {
            Paths = pathsList
        };

        return Ok(result);
    }

    [HttpPut("path/{pathId}")]
    public async Task<IActionResult> Update([FromRoute] int projectId, [FromBody] UpdatePathRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var project = _projectsService.GetProjectByIdAsync(projectId);
        if (project.Result == null)
        {
            _logger.LogError("Bad request, Project from route is invalid");
            return BadRequest("Bad request, Project from route is invalid");
        }

        var existingPath = await _pathsService.GetPathByIdAsync(request.Id);

        if (existingPath is null) return NotFound();

        var update = await _pathsService.UpdatePathAsync(request);

        if (!update) return BadRequest();

        var result = new PathResponse
        {
            Path = await _pathsService.GetPathByIdAsync(request.Id) ?? throw new InvalidOperationException()
        };

        return Ok(result);
    }


    [HttpDelete("path/{pathId}")]
    public async Task<IActionResult> Delete([FromRoute] int projectId, [FromRoute] string pathId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var project = _projectsService.GetProjectByIdAsync(projectId);
        if (project.Result == null)
        {
            _logger.LogError("Bad request, Project from route is invalid");
            return BadRequest("Bad request, Project from route is invalid");
        }

        var deleted = await _pathsService.DeletePathAsync(pathId);
        if (!deleted) return NotFound();

        var result = new DeletePathResponse
        {
            PathId = pathId
        };

        return Ok(result);
    }
}