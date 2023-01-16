using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Hubs;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Services.SignalR;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Endpoints.Users;

[Authorize]
public class AddFriendEndpoint : EndpointWithoutRequest<AddFriendResponse>
{
    private readonly IConnectionsService _connectionsService;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<AddFriendEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public AddFriendEndpoint(
        ILogger<AddFriendEndpoint> logger,
        IUsersService usersService,
        UserManager<AppUser> userManager,
        IHubContext<NotificationHub> hubContext,
        IConnectionsService connectionsService)
    {
        _logger = logger;
        _usersService = usersService;
        _userManager = userManager;
        _hubContext = hubContext;
        _connectionsService = connectionsService;
    }

    public override void Configure()
    {
        Post("/users/add/{username}");
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

        var sendRequest = await _usersService.AddFriendAsync(user, friendUsername);

        var result = new AddFriendResponse
        {
            Username = sendRequest.RequestedTo.UserName!
        };

        _logger.LogInformation("{Username} sent a friend request to {FriendUsername}", user.UserName, friendUsername);


        /*var notification = new NotificationDto<AppUserFriendDto>
        {
            Username = friendUsername,
            Status = NotificationStatus.Unread,
            Type = NotificationType.FriendRequest,
            TimeCreated = DateTime.Now,
            Notification = sendRequest.ToDto()
        };*/

        // await _hubContext.Clients.User(sendRequest.RequestedTo.UserName!).SendAsync("GetNotifications", notification, cancellationToken);
        // await _hubContext.Clients.User(friendUser.UserName!).SendAsync("GetNotifications", result.ToDto());
        /*var connections = await _connectionsService.GetUserConnections(friendUsername);
        var connectionIds = connections.Connections.Select(x => x.ConnectionId);
        await _hubContext.Clients.Clients(connectionIds)
            .SendAsync("GetNotifications", sendRequest.ToDto(), cancellationToken);*/

        // return Ok(result);

        await SendOkAsync(result, cancellationToken);
    }
}