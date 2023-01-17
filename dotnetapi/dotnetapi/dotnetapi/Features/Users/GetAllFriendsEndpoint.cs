using dotnetapi.Contracts.Responses.Users;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users;

[Authorize]
public class GetAllFriendsEndpoint : EndpointWithoutRequest<AllFriendsResponse>
{
    private readonly ILogger<GetAllFriendsEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public GetAllFriendsEndpoint(
        ILogger<GetAllFriendsEndpoint> logger,
        IUsersService usersService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _usersService = usersService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/users/friends");
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

        var allFriends = await _usersService.GetAllFriendsAsync(user);

        var response = new AllFriendsResponse
        {
            Friends = allFriends
        };

        await SendOkAsync(response, cancellationToken);
    }
}