using System.ComponentModel.DataAnnotations;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class SigninRequest
{
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
}

public class SignupRequest
{
    [Required] public string Username { get; init; } = default!;
    [Required] public string FirstName { get; init; } = default!;
    [Required] public string LastName { get; init; } = default!;
    [Required] public string Email { get; init; } = default!;

    [Required]
    [StringLength(14, MinimumLength = 4)]
    public string Password { get; init; } = default!;
}

public class LoginResponse
{
    public string Username { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; init; } = default!;
    public string Token { get; set; } = default!;
}

namespace dotnetapi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUsersService _usersService;


        public UsersController(
            ILogger<UsersController> logger,
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IUsersService usersService
        )
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _usersService = usersService;
        }


        [HttpPost("signin")]
        [Authorize]
        [AllowAnonymous]
        public async Task<IActionResult> Login(SigninRequest request)
        {
            var user = await _userManager.Users
                .SingleOrDefaultAsync(x => x.UserName == request.Username.ToLower());

            if (user == null)
            {
                _logger.LogError("Unauthorized, {Username} is invalid", request.Username);
                return NotFound();
            }

            var result = await _signInManager
                .CheckPasswordSignInAsync(user, request.Password, false);

            if (result.IsNotAllowed)
            {
                _logger.LogError("Unauthorized, Password is invalid");
                return Unauthorized();
            }

            var signInResult = await _usersService.HandleSignIn(user);
            if (signInResult.Token.IsNullOrEmpty())
            {
                _logger.LogError("Token Error");
                return BadRequest();
            }

            _logger.LogInformation("{Username} has logged in", user.UserName);
            return Ok(signInResult);
        }

        [HttpPost("register")]
        [Authorize]
        [AllowAnonymous]
        public async Task<IActionResult> Register(SignupRequest request)
        {
            if (await UserExists(request.Username))
            {
                _logger.LogError("Bad request, {Username} is taken", request.Username);
                return Conflict("Username is taken");
            }

            var appUser = request.ToEntity();
            appUser.UserName = request.Username.ToLower();

            var result = await _userManager.CreateAsync(appUser, request.Password);

            if (!result.Succeeded)
            {
                _logger.LogError("Bad request, {@Errors}", result.Errors);
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

            if (!roleResult.Succeeded)
            {
                _logger.LogError("Bad request, {@Errors}", result.Errors);
                return BadRequest(result.Errors);
            }

            _logger.LogInformation("{Username} has signed up", appUser.UserName);
            var signUpResult = await _usersService.HandleSignIn(appUser);
            if (signUpResult.Token.IsNullOrEmpty())
            {
                _logger.LogError("Token Error");
                return BadRequest();
            }

            _logger.LogInformation("{Username} has logged in", appUser.UserName);
            return Ok(signUpResult);
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}