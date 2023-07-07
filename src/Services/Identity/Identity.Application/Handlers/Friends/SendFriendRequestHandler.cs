using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Extensions;
using Identity.Application.Handlers.Notifications;
using Identity.Application.Logging;
using Identity.Contracts.Responses.Friends;
using Identity.Domain;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Friends;

public class SendFriendRequestHandler : ICommandHandler<SendFriendRequestCommand, bool>
{
    private readonly ILogger<SendFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly IMediator _mediator;

    public SendFriendRequestHandler(
        ILogger<SendFriendRequestHandler> logger,
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

    public async ValueTask<bool> Handle(SendFriendRequestCommand request, CancellationToken cT)
    {
        AppUser? appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(request.AuthUser.Id);
        var recipientUserId = request.RecipientUserId.ToGuid();
        AppUser? recipientUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(recipientUserId);
        appUser.ThrowHubExceptionIfNull();
        recipientUser.ThrowHubExceptionIfNull();
        var notificationCommand = new DispatchNotificationCommand(
            appUser,
            recipientUser,
            NotificationType.FriendRequestReceived
        );
        AppUserLink? appUserLink =
            await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsNoTrackingAsync(
                request.AuthUser.Id,
                recipientUserId
            );
        if (appUserLink is null)
        {
            appUserLink = AppUserLink.CreateWithFriendRequestSent(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogAppUserLinkCreated(
                appUser.UserName,
                appUser.UserName,
                recipientUser.UserName
            );
            await _mediator.Send(notificationCommand, cT);
            return true;
        }
        appUserLink.ThrowHubExceptionIfNull();
        appUserLink.SendFriendRequest(appUser);
        _unitOfWork.DetachAllEntities();
        await _unitOfWork.AppUserLinksRepository.UpdateAsync(appUserLink);
        await _unitOfWork.SaveChangesAsync().ConfigureAwait(false);

        await _mediator.Send(notificationCommand, cT);

        _logger.LogInformation(
            "User {UserName}: Friend request sent from AppUserRequested: {AppUserRequestedUserName}, AppUserReceived: {AppUserReceivedUserName}",
            appUser.UserName,
            appUser.UserName,
            recipientUser.UserName
        );

        return true;
    }
}
