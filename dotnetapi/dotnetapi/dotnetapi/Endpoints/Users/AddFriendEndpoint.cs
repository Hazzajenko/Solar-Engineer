using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Users;

[Authorize]
public class AddFriendEndpoint : EndpointWithoutRequest<AddFriendResponse>
{
    private readonly ILogger<AddFriendEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public AddFriendEndpoint(
        ILogger<AddFriendEndpoint> logger,
        IUsersService usersService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _usersService = usersService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/users/add/{Username}");
        // Description(b => b
        // .Accepts<string>("application/json"));
        // Authenticate
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, {Username} is invalid", user.UserName);
            ThrowError("Username is invalid");
        }

        var friendUsername = Route<string>("Username");
        if (string.IsNullOrEmpty(friendUsername)) ThrowError("No username given");

        var sendRequest = await _usersService.AddFriendAsync(user, friendUsername);

        var result = new AddFriendResponse
        {
            Username = sendRequest.RequestedTo.UserName!
        };

        _logger.LogInformation("{Username} sent a friend request to {FriendUsername}", user.UserName, friendUsername);
        // return Ok(result);

        await SendOkAsync(result, cancellationToken);
    }
}