﻿using Identity.Application.Data.UnitOfWork;
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

public class SendFriendRequestHandler : ICommandHandler<SendFriendRequestCommand, bool>
{
    private readonly ILogger<SendFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;

    public SendFriendRequestHandler(
        ILogger<SendFriendRequestHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(SendFriendRequestCommand request, CancellationToken cT)
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
            appUserLink = new AppUserLink(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            _logger.LogInformation(
                "Created new AppUserLink with AppUserRequested: {AppUserRequested}, AppUserReceived: {AppUserReceived}",
                appUser.UserName,
                recipientUser.UserName
            );
        }
        appUserLink.ThrowHubExceptionIfNull();
        _unitOfWork.Attach(appUserLink);
        var isAppUserRequested = appUserLink.AppUserRequestedId == appUser.Id;
        if (isAppUserRequested)
        {
            appUserLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestSent.Pending;
            appUserLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestReceived.Pending;
        }
        else
        {
            appUserLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestReceived.Pending;
            appUserLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestSent.Pending;
        }

        await _unitOfWork.SaveChangesAsync();

        var response = new FriendRequestResponse(
            appUser.Id,
            appUser.UserName,
            FriendRequestResponse.Status.Received
        );
        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveFriendRequestEvent(response);

        _logger.LogInformation(
            "Friend request sent from AppUserRequested: {AppUserRequestedId} - {AppUserRequestedUserName}, AppUserReceived: {AppUserReceived} - {AppUserReceivedUserName}",
            appUser.Id,
            appUser.UserName,
            recipientUser.Id,
            recipientUser.UserName
        );

        return true;
    }
}
