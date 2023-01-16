using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Friends;
using dotnetapi.Services.SignalR;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Endpoints.Friends;

[Authorize]
public class AddFriendEndpoint : EndpointWithoutRequest<AddFriendResponse>
{
    private readonly IConnectionsService _connectionsService;
    private readonly IFriendsService _friendsService;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<AddFriendEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public AddFriendEndpoint(
        ILogger<AddFriendEndpoint> logger,
        IFriendsService friendsService,
        UserManager<AppUser> userManager,
        IHubContext<NotificationHub> hubContext,
        IConnectionsService connectionsService)
    {
        _logger = logger;
        _friendsService = friendsService;
        _userManager = userManager;
        _hubContext = hubContext;
        _connectionsService = connectionsService;
    }

    public IHubContext<NotificationHub> HubContext { get; }

    public override void Configure()
    {
        Post("/friends/add/{username}");
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

        var friendUsername = Route<string>("username");
        if (string.IsNullOrEmpty(friendUsername)) ThrowError("No username given");

        var sendRequest = await _friendsService.AddFriendAsync(user, friendUsername);

        var result = new AddFriendResponse
        {
            Username = sendRequest.RequestedTo.UserName!
        };

        _logger.LogInformation("{Username} sent a friend request to {FriendUsername}", user.UserName, friendUsername);
        // return Ok(result);
        /*var connections = await _connectionsService.GetUserConnections(friendUsername);
        var connectionIds = connections.Connections.Select(x => x.ConnectionId);
        var enumerable = connectionIds as string[] ?? connectionIds.ToArray();*/
        /*await HubContext.Clients.Clients(enumerable)
            .SendAsync("GetNotifications", sendRequest.ToDto(), cancellationToken);

        await HubContext.Clients.Client(enumerable[0])
            .SendAsync("GetNotifications", sendRequest.ToDto(), cancellationToken);*/

        await SendOkAsync(result, cancellationToken);
    }
}