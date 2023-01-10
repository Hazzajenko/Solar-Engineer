using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using dotnetapi.Services.Strings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapi.Controllers;

[Route("projects/{projectId:int}")]
[ApiController]
[Authorize]
public class StringsController : ControllerBase
{
    private readonly ILogger<StringsController> _logger;
    private readonly IProjectsService _projectsService;
    private readonly IStringsService _stringsService;
    private readonly UserManager<AppUser> _userManager;


    public StringsController(
        ILogger<StringsController> logger,
        UserManager<AppUser> userManager,
        IStringsService stringsService,
        IProjectsService projectsService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _stringsService = stringsService;
        _projectsService = projectsService;
    }


    [HttpPost("string")]
    public async Task<IActionResult> CreateString([FromBody] CreateStringRequest request, [FromRoute] int projectId)
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


        var stringEntity = request.ToEntity(user);

        var stringDto = await _stringsService.CreateStringAsync(stringEntity, projectId);

        var result = new OneStringResponse
        {
            String = stringDto
        };

        return Ok(result);
        // return CreatedAtAction("Get", new { stringId = result.Id }, result);
    }

    [HttpGet("string/{stringId}")]
    public async Task<IActionResult> Get([FromRoute] int projectId, [FromRoute] string stringId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var stringDto = await _stringsService.GetStringByIdAsync(stringId);

        if (stringDto is null) return NotFound();
        var result = new OneStringResponse
        {
            String = stringDto
        };

        return Ok(result);
    }

    [HttpGet("strings")]
    public async Task<IActionResult> GetAllStringsByProjectId([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var stringDtos = await _stringsService.GetAllStringsByProjectIdAsync(projectId);

        var result = new ManyStringsResponse
        {
            Strings = stringDtos
        };

        return Ok(result);
    }

    [HttpPut("string/{stringId}")]
    public async Task<IActionResult> Update([FromRoute] int projectId, [FromBody] UpdateStringRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        // var existingString = await _stringsService.GetStringByIdAsync(request.Id);

        // if (existingString is null) return NotFound();

        // var stringEntity = request.ToEntity();
        var result = await _stringsService.UpdateStringAsync(request);

        if (!result) return BadRequest();

        return Ok(request);
    }

    [HttpDelete("string/{stringId}")]
    public async Task<IActionResult> Delete([FromRoute] int projectId, [FromRoute] string stringId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var existingString = await _stringsService.GetStringByIdAsync(stringId);

        if (existingString is null) return NotFound();

        var deleted = await _stringsService.DeleteAsync(stringId);
        if (!deleted) return NotFound();

        return Ok();
    }
}