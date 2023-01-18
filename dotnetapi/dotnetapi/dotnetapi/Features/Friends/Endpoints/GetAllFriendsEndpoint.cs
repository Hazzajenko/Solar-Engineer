using dotnetapi.Contracts.Responses.Users;
using dotnetapi.Features.Friends.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Friends.Endpoints;

[Authorize]
public class GetAllFriendsEndpoint : EndpointWithoutRequest<AllFriendsResponse>
{
    private readonly IFriendsService _friendsService;
    private readonly ILogger<GetAllFriendsEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public GetAllFriendsEndpoint(
        ILogger<GetAllFriendsEndpoint> logger,
        IFriendsService friendsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _friendsService = friendsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/friends");
        // Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var allFriends = await _friendsService.GetAllFriendsAsync(user);

        var response = new AllFriendsResponse
        {
            Friends = allFriends
        };

        await SendOkAsync(response, cancellationToken);
    }
}