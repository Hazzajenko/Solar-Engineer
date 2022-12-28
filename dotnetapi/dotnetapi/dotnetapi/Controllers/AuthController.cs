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

public class ValidateUserRequest
{
    public string Email { get; set; } = default!;
    public string Username { get; set; } = default!;
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
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;


        public AuthController(
            ILogger<AuthController> logger,
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IAuthService authService
        )
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
            _authService = authService;
        }

        [HttpPost("validate")]
        [Authorize]
        public async Task<IActionResult> ValidateUser(ValidateUserRequest request)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                _logger.LogError("Bad request, User is invalid");
                return Unauthorized("User is invalid");
            }

            var signInResult = await _authService.HandleSignIn(user);
            if (signInResult.Token.IsNullOrEmpty())
            {
                _logger.LogError("Token Error");
                return BadRequest();
            }

            _logger.LogInformation("{Username} has logged in", user.UserName);
            return Ok(signInResult);
        }


        [HttpPost("login")]
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

            var signInResult = await _authService.HandleSignIn(user);
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
            var signUpResult = await _authService.HandleSignIn(appUser);
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