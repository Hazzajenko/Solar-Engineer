using dotnetapi.Contracts.Responses.Users;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users;

[Authorize]
public class GetSentFriendRequestsEndpoint : EndpointWithoutRequest<FriendRequestsResponse>
{
    private readonly ILogger<GetSentFriendRequestsEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public GetSentFriendRequestsEndpoint(
        ILogger<GetSentFriendRequestsEndpoint> logger,
        IUsersService usersService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _usersService = usersService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/users/requests/sent");
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

        var sentRequests = await _usersService.GetSentRequestsAsync(user);

        var response = new FriendRequestsResponse
        {
            Requests = sentRequests
        };

        await SendOkAsync(response, cancellationToken);
    }
}