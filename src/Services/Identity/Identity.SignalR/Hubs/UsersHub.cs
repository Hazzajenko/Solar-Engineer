﻿using ApplicationCore.Extensions;
using Identity.Contracts.Data;
using Identity.Contracts.Requests.Users;
using Identity.Contracts.Responses.Friends;
using Identity.Domain;
using Identity.SignalR.Commands.AppUsers;
using Identity.SignalR.Commands.Connections;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Commands.Notifications;
using Identity.SignalR.Queries;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.SignalR.Hubs;

[Authorize]
public class UsersHub : Hub<IUsersHub>
{
    private readonly ILogger<UsersHub> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public UsersHub(IMediator mediator, ILogger<UsersHub> logger, UserManager<AppUser> userManager)
    {
        _mediator = mediator;
        _logger = logger;
        _userManager = userManager;
    }

    public override async Task OnConnectedAsync()
    {
        var authUser = Context.ToAuthUser();
        await _mediator.Send(new OnConnectedCommand(authUser));
        await _mediator.Send(new GetUserFriendsCommand(authUser));
        await _mediator.Send(new GetUserNotificationsCommand(authUser));
        await Clients.Caller.AppUserIsConnected();
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _mediator.Send(new OnDisconnectedCommand(Context.ToAuthUser()));

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendDeviceInfo(DeviceInfoDto deviceInfo)
    {
        await _mediator.Send(new SendDeviceInfoCommand(Context.ToAuthUser(), deviceInfo));
    }

    public async Task GetOnlineFriends()
    {
        await _mediator.Send(new GetOnlineFriendsQuery(Context.ToAuthUser()));
    }

    public async Task SearchForAppUserByUserName(string userName)
    {
        await _mediator.Send(new SearchForAppUserByUserNameQuery(Context.ToAuthUser(), userName));
    }

    public async Task SearchForAppUser(SearchForAppUserRequest request)
    {
        await _mediator.Send(new SearchForAppUserQuery(Context.ToAuthUser(), request));
    }

    public async Task SendFriendRequest(string recipientUserId)
    {
        await _mediator.Send(new SendFriendRequestCommand(Context.ToAuthUser(), recipientUserId));
    }

    public async Task AcceptFriendRequest(string senderUserId)
    {
        await _mediator.Send(new AcceptFriendRequestCommand(Context.ToAuthUser(), senderUserId));
    }

    public async Task RejectFriendRequest(string senderUserId)
    {
        await _mediator.Send(new RejectFriendRequestCommand(Context.ToAuthUser(), senderUserId));
    }

    public async Task DeleteFriend(string recipientUserId)
    {
        await _mediator.Send(new DeleteFriendCommand(Context.ToAuthUser(), recipientUserId));
    }

    public async Task ReceiveNotification(string notificationId)
    {
        await _mediator.Send(new ReceiveNotificationCommand(Context.ToAuthUser(), notificationId));
    }

    /*public async Task CancelFriendRequest(string recipientUserId)
    {
        // await _mediator.Send(new CancelFriendRequestCommand(Context.ToAuthUser(), recipientUserId));
    }

    public async Task Unfriend(string friendUserId)
    {
        // await _mediator.Send(new UnfriendCommand(Context.ToAuthUser(), friendUserId));
    }*/

    public async Task GetNotifications()
    {
        await _mediator.Send(new GetUserNotificationsCommand(Context.ToAuthUser()));
    }

    public async Task CompleteManyNotifications(IEnumerable<string> notificationIds)
    {
        await _mediator.Send(
            new CompleteManyNotificationsCommand(Context.ToAuthUser(), notificationIds)
        );
    }

    public async Task ReadManyNotifications(IEnumerable<string> notificationIds)
    {
        await _mediator.Send(
            new ReadManyNotificationsCommand(Context.ToAuthUser(), notificationIds)
        );
    }
}
