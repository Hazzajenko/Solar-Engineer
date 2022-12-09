using System.ComponentModel.DataAnnotations;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories;
using dotnetapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

public class CreateStringRequest
{
    [Required] public string Name { get; init; } = default!;
}


namespace dotnetapi.Controllers
{
    [Route("projects/{projectId:int}/[controller]")]
    [ApiController]
    [Authorize]
    public class StringsController : ControllerBase
    {
        private readonly ILogger<StringsController> _logger;
        private readonly IProjectsRepository _projectsRepository;
        private readonly IStringsService _stringsService;
        private readonly UserManager<AppUser> _userManager;


        public StringsController(
            ILogger<StringsController> logger,
            UserManager<AppUser> userManager,
            IStringsService stringsService,
            IProjectsRepository projectsRepository
        )
        {
            _logger = logger;
            _userManager = userManager;
            _stringsService = stringsService;
            _projectsRepository = projectsRepository;
        }


        [HttpPost]
        public async Task<IActionResult> CreateString([FromBody] CreateStringRequest request, [FromRoute] int projectId,
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


            var stringEntity = request.ToEntity();
            stringEntity.CreatedBy = user;
            stringEntity.Project = project.Result;


            return Ok(await _stringsService.CreateStringAsync(stringEntity, cancellationToken));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int projectId, [FromRoute] string id)
        {
            var z = await _stringsService.G(id);

            if (z is null) return NotFound();

            var v = z.x();
            return Ok(v);
        }

        [HttpGet("s")]
        public async Task<IActionResult> GetAll()
        {
            var x = await _stringsService.GetAllAsync();
            var z = x.v();
            return Ok(v);
        }

        [HttpPut("s/{id:guid}")]
        public async Task<IActionResult> Update(
            [FromMultiSource] x request)
        {
            var x = await _stringsService.GetAsync(request.Id);

            if (x is null) return NotFound();

            var z = request.ToCustomer();
            await _stringsService.UpdateAsync(z);

            var customerResponse = customer.ToCustomerResponse();
            return Ok(customerResponse);
        }

        [HttpDelete("s/{id:guid}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            var deleted = await _stringsService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return Ok();
        }
    }
}