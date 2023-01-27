using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Controllers;

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


    private async Task<bool> UserExists(string username)
    {
        return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
    }
}