
using System.ComponentModel.DataAnnotations;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using dotnetapi.Models.Entities;
using dotnetapi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


public class CreateProjectRequest {
    [Required] public string Name { get; init; } = default!;
}


namespace dotnetapi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ILogger<ProjectsController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IProjectsService _projectsService;


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
        [Authorize]

        public async Task<IActionResult> CreateProject(CreateProjectRequest request, CancellationToken cancellationToken)
        {
            
            var user = await _userManager.GetUserAsync(User);        
            if (user == null) {
                _logger.LogError("Bad request, User is invalid");
                return Unauthorized("User is invalid");
            }
            
            var appUserProject = user.ToAppUserProject();


            var project = request.ToEntity();
            project.CreatedBy = user;
            project.AppUserProjects = new List<AppUserProject> {
                appUserProject
            };
            appUserProject.Project = project;

           return Ok(await _projectsService.CreateProject(appUserProject, cancellationToken));
        }
        
    }
}