using Identity.Application.Data.UnitOfWork;
using Identity.Application.Handlers.Notifications;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Friends;
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

    public AcceptFriendRequestHandler(
        ILogger<AcceptFriendRequestHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _mediator = mediator;
    }

    public async ValueTask<bool> Handle(AcceptFriendRequestCommand request, CancellationToken cT)
    {
        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(request.AuthUser.Id);
        var recipientUserId = request.RecipientUserId.ToGuid();
        var recipientUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(recipientUserId);
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
                appUser.UserName,
                recipientUser.UserName
            );
            appUserLink = new AppUserLink(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            _logger.LogInformation(
                "Created new AppUserLink with AppUserRequested: {AppUserRequested}, AppUserReceived: {AppUserReceived}",
                appUser.UserName,
                recipientUser.UserName
            );
            return await _unitOfWork.SaveChangesAsync();
        }
        appUserLink.ThrowHubExceptionIfNull();
        appUserLink.AcceptFriendRequest();
        await _unitOfWork.AppUserLinksRepository.UpdateAsync(appUserLink);
        await _unitOfWork.SaveChangesAsync();

        await _hubContext.Clients
            .User(appUser.Id.ToString())
            .ReceiveFriend(recipientUser.Adapt<FriendDto>());

        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveFriend(appUser.Adapt<FriendDto>());

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

        await _unitOfWork.NotificationsRepository.UpdateAsync(friendRequestNotification);
        await _unitOfWork.SaveChangesAsync();

        var notificationDto = friendRequestNotification.Adapt<NotificationDto>();

        await _hubContext.Clients.User(appUser.Id.ToString()).UpdateNotification(notificationDto);

        _logger.LogInformation(
            "Friend request accepted from AppUserRequested: {AppUserRequestedId} - {AppUserRequestedUserName}, AppUserReceived: {AppUserReceived} - {AppUserReceivedUserName}",
            appUser.Id,
            appUser.UserName,
            recipientUser.Id,
            recipientUser.UserName
        );

        return true;

        /*
        var response = new FriendRequestResponse(
            appUser.Id,
            appUser.UserName,
            FriendRequestResponse.Status.Accepted
        );
        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveFriendRequestEvent(response);

        var notification = new Notification(
            recipientUser,
            appUser,
            NotificationType.FriendRequestAccepted
        );

        await _unitOfWork.NotificationsRepository.AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        var originalSenderId = recipientUser.Id;
        var notificationFromSender =
            await _unitOfWork.NotificationsRepository.GetNotificationFromSenderToAppUserByTypeAsync(
                originalSenderId,
                appUser.Id,
                NotificationType.FriendRequestReceived
            );
        notificationFromSender.ThrowHubExceptionIfNull();

        notificationFromSender.SetNotificationCompleted();
        await _unitOfWork.NotificationsRepository.UpdateAsync(notificationFromSender);
        await _unitOfWork.SaveChangesAsync();

        var notificationDto = await _unitOfWork.NotificationsRepository.GetNotificationDtoByIdAsync(
            notification.Id
        );
        notificationDto.ThrowHubExceptionIfNull();

        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveNotification(notificationDto);

        _logger.LogInformation(
            "Friend request accepted from AppUserRequested: {AppUserRequestedId} - {AppUserRequestedUserName}, AppUserReceived: {AppUserReceived} - {AppUserReceivedUserName}",
            appUser.Id,
            appUser.UserName,
            recipientUser.Id,
            recipientUser.UserName
        );

        return true;*/
    }
}
