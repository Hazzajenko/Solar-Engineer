﻿using dotnetapi.Features.Friends.Contracts.Responses;
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
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var friendUsername = Route<string>("username");
        if (string.IsNullOrEmpty(friendUsername)) ThrowError("No username given");

        var sendRequest = await _friendsService.AddFriendAsync(user, friendUsername);

        var notification = await _notificationsService.SendFriendRequestToUserAsync(sendRequest);
        // var notification = await _notificationsService.SendFriendRequestToUserAsync(user.UserName!, friendUsername);
        /*if (notification is null)
        {
            _logger.LogError("Unable to create notification");
            ThrowError("Unable to create notification");
        }*/
        /*var sendRequest = await _mediator.Send(new AddFriendHandlerRequest
        {
            AppUser = user,
            FriendUsername = friendUsername
        });*/

        var result = new AddFriendResponse
        {
            FriendRequestSentTo = sendRequest.RequestedTo.UserName!
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