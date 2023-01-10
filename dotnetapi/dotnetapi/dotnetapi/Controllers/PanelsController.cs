using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Requests.Panels;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Panels;
using dotnetapi.Services.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapi.Controllers;

[Route("projects/{projectId:int}")]
[ApiController]
public class PanelsController : ControllerBase
{
    private readonly ILogger<PanelsController> _logger;
    private readonly IPanelsService _panelsService;
    private readonly IProjectsService _projectsService;

    private readonly UserManager<AppUser> _userManager;


    public PanelsController(
        ILogger<PanelsController> logger,
        UserManager<AppUser> userManager,
        IPanelsService panelsService,
        IProjectsService projectsService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _panelsService = panelsService;
        _projectsService = projectsService;
    }


    [HttpPost("panel")]
    [Authorize]
    public async Task<IActionResult> CreatePanel([FromBody] CreatePanelRequest request, [FromRoute] int projectId)
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

        var panelEntity = request.ToEntity(user);

        var panelDto = await _panelsService.CreatePanelAsync(panelEntity, projectId, request.StringId);

        var result = new OnePanelResponse
        {
            Panel = panelDto
        };

        return Ok(result);
    }

    [HttpPost("panels")]
    [Authorize]
    public async Task<IActionResult> CreateManyPanels([FromBody] CreateManyPanelsRequest request,
        [FromRoute] int projectId)
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

        var panelEntities = request.Panels.Select(x => x.ToEntity(user));
        // var panelEntity = request.ToEntity(user);

        var amountOfCreates = await _panelsService.CreateManyPanelsAsync(panelEntities, projectId, request.StringId);

        var result = new CreateManyPanelsResponse
        {
            AmountOfCreates = amountOfCreates
        };

        return Ok(result);
    }

    [HttpGet("panel/{panelId}")]
    public async Task<IActionResult> GetPanel([FromRoute] int projectId, [FromRoute] string panelId)
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

        var panelDto = await _panelsService.GetPanelByIdAsync(panelId);

        if (panelDto is null) return NotFound();

        var result = new OnePanelResponse
        {
            Panel = panelDto
        };

        return Ok(result);
    }

    [HttpGet("panels")]
    public async Task<IActionResult> GetPanelsByProjectId([FromRoute] int projectId)
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

        var panelList = await _panelsService.GetAllPanelsByProjectIdAsync(projectId);

        var result = new ManyPanelsResponse
        {
            Panels = panelList
        };

        return Ok(result);
    }

    [HttpPut("panel/{panelId}")]
    public async Task<IActionResult> Update([FromRoute] int projectId, [FromBody] UpdatePanelRequest request)
        // public async Task<IActionResult> Update([FromRoute] int projectId, [FromBody] UpdatePanelRequest request)
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

        var existingPanel = await _panelsService.GetPanelByIdAsync(request.Id);

        if (existingPanel is null) return NotFound();

        // var panelEntity = request.ToEntity();
        var update = await _panelsService.UpdatePanelAsync(request);

        if (!update) return BadRequest();

        var result = new OnePanelResponse
        {
            Panel = await _panelsService.GetPanelByIdAsync(request.Id) ?? throw new InvalidOperationException()
        };

        return Ok(result);
    }

    [HttpPut("panels")]
    public async Task<IActionResult> UpdateManyPanels([FromRoute] int projectId,
        [FromBody] UpdateManyPanelsRequest request)
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

        var updates = await _panelsService.UpdateManyPanelsAsync(request);

        var successfulUpdates = 0;
        var errors = 0;
        foreach (var update in updates)
            if (!update)
                errors++;
            else
                successfulUpdates++;


        var result = new ManyPanelsUpdatesResponse
        {
            SuccessfulUpdates = successfulUpdates,
            Errors = errors
        };

        /*
        var updatedResult =
        {
            new int() dsi = successfulUpdates
        }
        */

        return Ok(result);
    }

    [HttpDelete("panel/{panelId}")]
    public async Task<IActionResult> Delete([FromRoute] int projectId, [FromRoute] string panelId)
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

        var existingPanel = await _panelsService.GetPanelByIdAsync(panelId);

        if (existingPanel is null) return NotFound();

        var deleted = await _panelsService.DeletePanelAsync(panelId);
        if (!deleted) return NotFound();

        var result = new OnePanelDeleteResponse
        {
            PanelId = panelId
        };

        return Ok(result);
    }

    [HttpDelete("panels")]
    public async Task<IActionResult> DeleteManyPanels([FromRoute] int projectId,
        [FromBody] DeleteManyPanelsRequest request)
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

        var deletes = await _panelsService.DeleteManyPanelsAsync(request);

        var successfulDeletes = 0;
        var errors = 0;
        foreach (var del in deletes)
            if (!del)
                errors++;
            else
                successfulDeletes++;


        var result = new ManyPanelsDeletesResponse
        {
            SuccessfulDeletes = successfulDeletes,
            Errors = errors
        };


        return Ok(result);
    }
}