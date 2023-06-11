using Identity.Application.Data.UnitOfWork;
using Identity.Contracts.Responses.Friends;
using Identity.Domain;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUserLinks;

public class RejectFriendRequestHandler : ICommandHandler<RejectFriendRequestCommand, bool>
{
    private readonly ILogger<RejectFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;

    public RejectFriendRequestHandler(
        ILogger<RejectFriendRequestHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(RejectFriendRequestCommand request, CancellationToken cT)
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
                "AppUserLink with AppUserRequested: {AppUserRequested}, AppUserReceived: {AppUserReceived} not found. Cannot accept reject request. Creating new AppUserLink...",
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
        _unitOfWork.Attach(appUserLink);
        var isAppUserRequested = appUserLink.AppUserRequestedId == appUser.Id;
        if (isAppUserRequested)
        {
            appUserLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestSent.Rejected;
            appUserLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestReceived.Rejected;
        }
        else
        {
            appUserLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestReceived.Rejected;
            appUserLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestSent.Rejected;
        }

        await _unitOfWork.SaveChangesAsync();

        var response = new FriendRequestResponse(
            appUser.Id,
            appUser.UserName,
            FriendRequestResponse.Status.Rejected
        );
        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveFriendRequestEvent(response);

        _logger.LogInformation(
            "Friend request rejected from AppUserRequested: {AppUserRequestedId} - {AppUserRequestedUserName}, AppUserReceived: {AppUserReceived} - {AppUserReceivedUserName}",
            appUser.Id,
            appUser.UserName,
            recipientUser.Id,
            recipientUser.UserName
        );

        return true;
    }
}
