using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Extensions;
using Identity.Application.Handlers.Notifications;
using Identity.Application.Logging;
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

public class RejectFriendRequestHandler : ICommandHandler<RejectFriendRequestCommand, bool>
{
    private readonly ILogger<RejectFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly IMediator _mediator;

    public RejectFriendRequestHandler(
        ILogger<RejectFriendRequestHandler> logger,
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

    public async ValueTask<bool> Handle(RejectFriendRequestCommand request, CancellationToken cT)
    {
        AppUser? appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(request.AuthUser.Id);
        var recipientUserId = request.RecipientUserId.ToGuid();
        AppUser? recipientUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(recipientUserId);
        appUser.ThrowHubExceptionIfNull();
        recipientUser.ThrowHubExceptionIfNull();
        AppUserLink? appUserLink = await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsAsync(
            request.AuthUser.Id,
            recipientUserId
        );
        if (appUserLink is null)
        {
            _logger.LogAppUserLinkNotFound(
                appUser.UserName,
                appUser.UserName,
                recipientUser.UserName
            );
            appUserLink = new AppUserLink(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            _logger.LogAppUserLinkCreated(
                appUser.UserName,
                appUser.UserName,
                recipientUser.UserName
            );
            return await _unitOfWork.SaveChangesAsync();
        }
        appUserLink.ThrowHubExceptionIfNull();
        appUserLink.RejectFriendRequest(appUser);
        _unitOfWork.DetachAllEntities();
        await _unitOfWork.AppUserLinksRepository.UpdateAsync(appUserLink);
        await _unitOfWork.SaveChangesAsync();

        Guid originalSenderId = recipientUser.Id;
        Notification? friendRequestNotification =
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
            "User {UserName}: Friend request rejected from AppUserRequested: {AppUserRequestedUserName}, AppUserReceived: {AppUserReceivedUserName}",
            appUser.UserName,
            appUser.UserName,
            recipientUser.UserName
        );

        return true;
    }
}
