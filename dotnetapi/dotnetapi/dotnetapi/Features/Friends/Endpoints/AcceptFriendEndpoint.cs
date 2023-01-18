using dotnetapi.Contracts.Responses.Friends;
using dotnetapi.Features.Friends.Services;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Friends.Endpoints;

[Authorize]
public class AcceptFriendEndpoint : EndpointWithoutRequest<AcceptFriendResponse>
{
    private readonly IFriendsService _friendsService;
    private readonly ILogger<AcceptFriendEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public AcceptFriendEndpoint(
        ILogger<AcceptFriendEndpoint> logger,
        IFriendsService friendsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _friendsService = friendsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/friend/accept/{username}");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var friendUsername = Route<string>("username");
        if (string.IsNullOrEmpty(friendUsername)) ThrowError("No username given");

        var acceptRequest = await _friendsService.AcceptFriendAsync(user, friendUsername);

        _logger.LogInformation("{Username} accepted a friend request from {FriendUsername}", user.UserName,
            friendUsername);
        // return Ok(acceptRequest);

        var response = new AcceptFriendResponse
        {
            Friend = new FriendDto
            {
                Username = friendUsername,
                BecameFriendsTime = acceptRequest.BecameFriendsTime
            }
        };

        await SendOkAsync(response, cancellationToken);
    }
}