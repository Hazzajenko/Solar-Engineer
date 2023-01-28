using dotnetapi.Contracts.Responses.Users;
using dotnetapi.Features.Friends.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Friends.Endpoints;

[Authorize]
public class GetSentFriendRequestsEndpoint : EndpointWithoutRequest<FriendRequestsResponse>
{
    private readonly IFriendsService _friendsService;
    private readonly ILogger<GetSentFriendRequestsEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;


    public GetSentFriendRequestsEndpoint(
        ILogger<GetSentFriendRequestsEndpoint> logger,
        IFriendsService friendsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _friendsService = friendsService;

        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/friends/sent");
        Policies("BeAuthenticated");
        // Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var sentRequests = await _friendsService.GetSentRequestsAsync(user);

        var response = new FriendRequestsResponse
        {
            Requests = sentRequests
        };

        await SendOkAsync(response, cancellationToken);
    }
}