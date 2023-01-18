/*using dotnetapi.Contracts.Responses.Auth;
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
    public async Task<IActionResult> AddFriend([FromRoute] string username)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var sendRequest = await _usersService.AddFriendAsync(user, username);

        var result = new AddFriendResponse
        {
            Username = sendRequest.RequestedTo.UserName!
        };

        _logger.LogInformation("{Username} sent a friend request to {FriendUsername}", user.UserName, username);
        return Ok(result);
    }

    [HttpPost("accept/{username}")]
    [Authorize]
    public async Task<IActionResult> AcceptFriend([FromRoute] string username)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var acceptRequest = await _usersService.AcceptFriendAsync(user, username);
        

        _logger.LogInformation("{Username} accepted a friend request from {FriendUsername}", user.UserName, username);
        return Ok(acceptRequest);
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

    [HttpGet("friends")]
    [Authorize]
    public async Task<IActionResult> GetAllFriends()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var allFriends = await _usersService.GetAllFriendsAsync(user);

        return Ok(allFriends);
    }

    [HttpGet("requests/sent")]
    [Authorize]
    public async Task<IActionResult> GetSentFriendRequests()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var filter = "All";

        if (!string.IsNullOrEmpty(HttpContext.Request.Query["filter"]))
            filter = HttpContext.Request.Query["filter"];
        Console.WriteLine(filter);


        var sentRequests = _usersService.GetSentRequestsAsync(user);

        return Ok(sentRequests.Result);
    }

    [HttpGet("requests/received")]
    [Authorize]
    public async Task<IActionResult> GetReceivedFriendRequests()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            return Unauthorized("User is invalid");
        }

        var sentRequests = _usersService.GetReceivedRequestsAsync(user);

        return Ok(sentRequests.Result);
    }

    private async Task<bool> UserExists(string username)
    {
        return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
    }
}*/

