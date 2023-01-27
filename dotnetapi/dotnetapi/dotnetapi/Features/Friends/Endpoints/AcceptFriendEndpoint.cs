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
            ThrowError("UserName is invalid");
        }

        var friendUserName = Route<string>("username");
        if (string.IsNullOrEmpty(friendUserName)) ThrowError("No username given");

        var acceptRequest = await _friendsService.AcceptFriendAsync(user, friendUserName);

        _logger.LogInformation("{UserName} accepted a friend request from {FriendUserName}", user.UserName,
            friendUserName);
        // return Ok(acceptRequest);

        var response = new AcceptFriendResponse
        {
            Friend = new FriendDto
            {
                UserName = friendUserName,
                BecameFriendsTime = acceptRequest.BecameFriendsTime
            }
        };

        await SendOkAsync(response, cancellationToken);
    }
}