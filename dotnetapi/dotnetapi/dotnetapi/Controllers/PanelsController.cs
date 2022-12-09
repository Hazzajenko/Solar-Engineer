using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories;
using dotnetapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

public class CreatePanelRequest
{
    [Required] public string Name { get; init; } = default!;
    [Required] public string StringId { get; init; } = default!;
    [Required] public string Location { get; init; } = default!;
    [Required] public int Rotation { get; init; }
}


namespace dotnetapi.Controllers
{
    [Route("projects/{projectId:int}/[controller]")]
    [ApiController]
    public class PanelsController : ControllerBase
    {
        private readonly ILogger<PanelsController> _logger;
        private readonly IPanelsService _panelsService;
        private readonly IProjectsRepository _projectsRepository;
        private readonly UserManager<AppUser> _userManager;


        public PanelsController(
            ILogger<PanelsController> logger,
            UserManager<AppUser> userManager,
            IPanelsService panelsService,
            IProjectsRepository projectsRepository
        )
        {
            _logger = logger;
            _userManager = userManager;
            _panelsService = panelsService;
            _projectsRepository = projectsRepository;
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePanel([FromBody] CreatePanelRequest request, [FromRoute] int projectId,
            CancellationToken cancellationToken)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogError("Bad request, User is invalid");
                return Unauthorized("User is invalid");
            }

            var project = _projectsRepository.GetById(projectId, cancellationToken);
            if (project.Result == null)
            {
                _logger.LogError("Bad request, Project from route is invalid");
                return BadRequest("Bad request, Project from route is invalid");
            }

            Panel? panel;
            using (var r = new StreamReader("Data/Json/Panels/longi555m.json"))
            {
                var json = await r.ReadToEndAsync(cancellationToken);
                panel =
                    JsonSerializer.Deserialize<Panel>(json);
            }

            if (panel is null)
            {
                _logger.LogError("Unable to get panel data");
                return NotFound("Unable to get panel data");
            }

            panel.CreatedBy = user;
            panel.Name = request.Name;
            panel.Location = request.Location;
            panel.Rotation = request.Rotation;
            panel.StringId = request.StringId;
            panel.Project = project.Result;

            var result = await _panelsService.CreatePanel(panel, cancellationToken);

            return Ok(result);
        }
    }
}