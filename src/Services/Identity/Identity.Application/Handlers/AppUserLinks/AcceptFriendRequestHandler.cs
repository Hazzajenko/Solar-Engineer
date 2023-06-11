using Identity.Application.Data.UnitOfWork;
using Identity.Contracts.Responses.Friends;
using Identity.Domain;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUserLinks;

public class AcceptFriendRequestHandler : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly ILogger<AcceptFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;

    public AcceptFriendRequestHandler(
        ILogger<AcceptFriendRequestHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
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
        _unitOfWork.Attach(appUserLink);
        var isAppUserRequested = appUserLink.AppUserRequestedId == appUser.Id;
        if (isAppUserRequested)
        {
            appUserLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestSent.Accepted;
            appUserLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestReceived.Accepted;
        }
        else
        {
            appUserLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestReceived.Accepted;
            appUserLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestSent.Accepted;
        }

        await _unitOfWork.SaveChangesAsync();

        var response = new FriendRequestResponse(
            appUser.Id,
            appUser.UserName,
            FriendRequestResponse.Status.Accepted
        );
        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveFriendRequestEvent(response);

        _logger.LogInformation(
            "Friend request accepted from AppUserRequested: {AppUserRequestedId} - {AppUserRequestedUserName}, AppUserReceived: {AppUserReceived} - {AppUserReceivedUserName}",
            appUser.Id,
            appUser.UserName,
            recipientUser.Id,
            recipientUser.UserName
        );

        return true;
    }
}
