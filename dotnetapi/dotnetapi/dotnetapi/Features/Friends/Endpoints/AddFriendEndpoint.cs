using dotnetapi.Features.Friends.Contracts.Responses;
using dotnetapi.Features.Friends.Services;
using dotnetapi.Features.Notifications.Services;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using dotnetapi.Services.SignalR;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Friends.Endpoints;

[Authorize]
public class AddFriendEndpoint : EndpointWithoutRequest<AddFriendResponse>
{
    private readonly IConnectionsService _connectionsService;
    private readonly IFriendsService _friendsService;
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly ILogger<AddFriendEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly INotificationsService _notificationsService;
    private readonly UserManager<AppUser> _userManager;

    public AddFriendEndpoint(
        ILogger<AddFriendEndpoint> logger,
        IFriendsService friendsService,
        UserManager<AppUser> userManager,
        IHubContext<NotificationsHub> hubContext,
        IConnectionsService connectionsService,
        INotificationsService notificationsService,
        IMediator mediator)
    {
        _logger = logger;
        _friendsService = friendsService;
        _userManager = userManager;
        _hubContext = hubContext;
        _connectionsService = connectionsService;
        _notificationsService = notificationsService;
        _mediator = mediator;
    }

    // public IHubContext<NotificationHub> HubContext { get; }

    public override void Configure()
    {
        Post("/friend/{username}");
        Policies("BeAuthenticated");
        // Description(b => b
        // .Accepts<string>("application/json"));
        // Authenticate
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

        var sendRequest = await _friendsService.AddFriendAsync(user, friendUserName);

        var notification = await _notificationsService.SendFriendRequestToUserAsync(sendRequest);
        // var notification = await _notificationsService.SendFriendRequestToUserAsync(user.UserName!, friendUserName);
        /*if (notification is null)
        {
            _logger.LogError("Unable to create notification");
            ThrowError("Unable to create notification");
        }*/
        /*var sendRequest = await _mediator.Send(new AddFriendHandlerRequest
        {
            AppUser = user,
            FriendUserName = friendUserName
        });*/

        var result = new AddFriendResponse
        {
            FriendRequestSentTo = sendRequest.RequestedTo.UserName!
        };

        _logger.LogInformation("{UserName} sent a friend request to {FriendUserName}", user.UserName, friendUserName);
        // return Ok(result);
        /*var connections = await _connectionsService.GetUserConnections(friendUserName);
        var connectionIds = connections.Connections.Select(x => x.ConnectionId);
        var enumerable = connectionIds as string[] ?? connectionIds.ToArray();*/
        /*await HubContext.Clients.Clients(enumerable)
            .SendAsync("GetNotifications", sendRequest.ToDto(), cancellationToken);

        await HubContext.Clients.Client(enumerable[0])
            .SendAsync("GetNotifications", sendRequest.ToDto(), cancellationToken);*/

        await SendOkAsync(result, cancellationToken);
    }
}