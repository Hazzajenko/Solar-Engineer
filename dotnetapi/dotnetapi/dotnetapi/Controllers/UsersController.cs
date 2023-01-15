using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Auth;
using dotnetapi.Services.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Controllers;

[Route("[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<UsersController> _logger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;


    public UsersController(
        ILogger<UsersController> logger,
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        IUsersService usersService,
        IAuthService authService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _usersService = usersService;
        _authService = authService;
    }

    [HttpPost("add/{username}")]
    [Authorize]
    public async Task<IActionResult> ValidateUser([FromRoute] string username)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        /*if (await UserExists(username))
        {
            _logger.LogError("Cannot add {Username}, does not exist", username);
            return NotFound();
        }*/

        var sendRequest = await _usersService.AddFriendAsync(user, username);

        // if (sendRequest.) return NotFound();
        /*if (sendRequest is null)
        {
            return NotFound($"{username} not found");
        }*/

        var result = new AddFriendResponse
        {
            Username = sendRequest.RequestedTo.UserName!
        };

        // _logger.LogInformation("{Username} has logged in", user.UserName);
        return Ok(result);
    }


    [HttpPost("current")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        return Ok(user);
    }

    [HttpPost("friends/sent")]
    [Authorize]
    public async Task<IActionResult> GetSentFriendRequests()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var sentRequests = _usersService.GetSentRequestsAsync(user);

        return Ok(sentRequests.Result);
    }

    private async Task<bool> UserExists(string username)
    {
        return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
    }
}