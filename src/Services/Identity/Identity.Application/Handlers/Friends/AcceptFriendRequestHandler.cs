﻿using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Extensions;
using Identity.Application.Handlers.Notifications;
using Identity.Application.Mapping;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Friends;
using Identity.Contracts.Responses.Notifications;
using Identity.Domain;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mapster;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Friends;

public class AcceptFriendRequestHandler : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly ILogger<AcceptFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly IMediator _mediator;
    private readonly IConnectionsService _connectionsService;

    public AcceptFriendRequestHandler(
        ILogger<AcceptFriendRequestHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IMediator mediator,
        IConnectionsService connectionsService
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _mediator = mediator;
        _connectionsService = connectionsService;
    }

    public async ValueTask<bool> Handle(AcceptFriendRequestCommand request, CancellationToken cT)
    {
        var appUser = await _unitOfWork.AppUsersRepository.GetByIdNoTracking(request.AuthUser.Id);
        var recipientUserId = request.RecipientUserId.ToGuid();
        var recipientUser = await _unitOfWork.AppUsersRepository.GetByIdNoTracking(recipientUserId);
        appUser.ThrowHubExceptionIfNull();
        recipientUser.ThrowHubExceptionIfNull();

        var appUserLink = await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsAsync(
            request.AuthUser.Id,
            recipientUserId
        );

        if (appUserLink is null)
        {
            _logger.LogError(
                "AppUserLink with AppUserRequested: {AppUserRequested}, AppUserReceived: {AppUserReceived} not found. Cannot accept friend request. Creating new AppUserLink...",
                appUser.ToAppUserLog(),
                recipientUser.ToAppUserLog()
            );
            appUserLink = new AppUserLink(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            _logger.LogInformation(
                "Created new AppUserLink with AppUserRequested: {AppUserRequested}, AppUserReceived: {AppUserReceived}",
                appUser.ToAppUserLog(),
                recipientUser.ToAppUserLog()
            );
            return await _unitOfWork.SaveChangesAsync();
        }
        appUserLink.ThrowHubExceptionIfNull();
        appUserLink.AcceptFriendRequest();
        _unitOfWork.DetachAllEntities();
        await _unitOfWork.AppUserLinksRepository.UpdateAsync(appUserLink);
        await _unitOfWork.SaveChangesAsync();

        var recipientOnline = _connectionsService.IsUserOnline(recipientUser.Id);

        await _hubContext.Clients
            .User(appUser.Id.ToString())
            .ReceiveFriend(
                new ReceiveFriendResponse
                {
                    Friend = recipientUser.ToFriendWebUserDto(recipientOnline)
                }
            );

        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveFriend(new ReceiveFriendResponse { Friend = appUser.ToFriendWebUserDto(true) });

        var notificationCommand = new DispatchNotificationCommand(
            appUser,
            recipientUser,
            NotificationType.FriendRequestAccepted
        );
        await _mediator.Send(notificationCommand, cT);

        var originalSenderId = recipientUser.Id;
        var friendRequestNotification =
            await _unitOfWork.NotificationsRepository.GetNotificationFromSenderToAppUserByTypeAsync(
                originalSenderId,
                appUser.Id,
                NotificationType.FriendRequestReceived
            );
        friendRequestNotification.ThrowHubExceptionIfNull();
        friendRequestNotification.SetNotificationCompleted();

        _unitOfWork.DetachAllEntities();
        await _unitOfWork.NotificationsRepository.UpdateAsync(friendRequestNotification);

        await _unitOfWork.SaveChangesAsync();

        var notificationDto = friendRequestNotification.Adapt<NotificationDto>();

        var updateNotificationResponse = new UpdateNotificationResponse
        {
            Notification = notificationDto
        };

        await _hubContext.Clients
            .User(appUser.Id.ToString())
            .UpdateNotification(updateNotificationResponse);

        _logger.LogInformation(
            "Friend request accepted from AppUserRequested: {AppUserRequested}, AppUserReceived: {AppUserReceived}",
            appUser.ToAppUserLog(),
            recipientUser.ToAppUserLog()
        );

        return true;
    }
}
