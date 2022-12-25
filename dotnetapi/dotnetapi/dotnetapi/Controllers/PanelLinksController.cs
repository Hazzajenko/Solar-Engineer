using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapi.Controllers;

[Route("projects/{projectId:int}")]
[ApiController]
public class PanelLinksController : ControllerBase
{
    private readonly ILogger<PanelLinksController> _logger;
    private readonly IPanelLinksService _panelLinksService;

    private readonly IProjectsService _projectsService;

    private readonly UserManager<AppUser> _userManager;


    public PanelLinksController(
        ILogger<PanelLinksController> logger,
        UserManager<AppUser> userManager,
        IPanelLinksService panelLinksService,
        IProjectsService projectsService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _panelLinksService = panelLinksService;

        _projectsService = projectsService;
    }


    [HttpPost("link")]
    [Authorize]
    public async Task<IActionResult> CreateLink([FromBody] CreatePanelLinkRequest request, [FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        /*
        var project = _projectsService.GetProjectByIdAsync(projectId);
        if (project.Result == null)
        {
            _logger.LogError("Bad request, Project from route is invalid");
            return BadRequest("Bad request, Project from route is invalid");
        }*/

        var panelLinkEntity = request.ToEntity();
        panelLinkEntity.ProjectId = projectId;

        var panelLinkDto = await _panelLinksService.CreatePanelLinkAsync(panelLinkEntity);

        var result = new OnePanelLinkResponse
        {
            Link = panelLinkDto
        };

        return Ok(result);
    }


    [HttpGet("link/{panelLinkId}")]
    public async Task<IActionResult> GetPanel([FromRoute] int projectId, [FromRoute] string panelLinkId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var panelLinkDto = await _panelLinksService.GetPanelLinkByIdAsync(panelLinkId);

        if (panelLinkDto is null) return NotFound();

        var result = new OnePanelLinkResponse
        {
            Link = panelLinkDto
        };

        return Ok(result);
    }

    [HttpGet("links")]
    public async Task<IActionResult> GetPanelLinksByProjectId([FromRoute] int projectId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var panelLinksList = await _panelLinksService.GetAllPanelLinksByProjectIdAsync(projectId);

        var result = new ManyPanelLinksResponse
        {
            Links = panelLinksList
        };

        return Ok(result);
    }


    [HttpDelete("link/{panelLinkId}")]
    public async Task<IActionResult> Delete([FromRoute] int projectId, [FromRoute] string panelLinkId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var deleted = await _panelLinksService.DeletePanelLinkAsync(panelLinkId);
        if (!deleted) return NotFound();

        var result = new OnePanelLinkDeleteResponse
        {
            LinkId = panelLinkId
        };

        return Ok(result);
    }
}