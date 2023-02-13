﻿namespace Users.API.Endpoints;

/*
[Authorize]
public class RejectFriendRequestEndpoint : Endpoint<SendFriendRequestRequest>
{
    private readonly ILogger<RejectFriendRequestEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public RejectFriendRequestEndpoint(
        ILogger<RejectFriendRequestEndpoint> logger,
        UserManager<AppUser> userManager,
        IMediator mediator
    )
    {
        _logger = logger;
        _userManager = userManager;
        _mediator = mediator;
    }


    public override void Configure()
    {
        Put("/users/{@username}/reject", x => new { x.UserName });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(SendFriendRequestRequest request, CancellationToken cT)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var recipientUser = await _mediator.Send(new GetUserByUserNameQuery(request.UserName), cT);
        if (recipientUser is null)
        {
            _logger.LogError("Bad request, recipientUser {User} is invalid", request.UserName);
            ThrowError("recipientUser is invalid");
        }

        var appUserLink = await _mediator.Send(
            new GetOrCreateAppUserLinkCommand(appUser, recipientUser),
            cT
        );

        var changes = new AppUserLinkChanges { UserToUserStatus = UserToUserStatus.Rejected };

        var isAppUserRequested = appUserLink.AppUserRequested.UserName == appUser.UserName!;
        if (isAppUserRequested)
        {
            changes.AppUserRequestedToUserStatus = UserStatus.FriendRequestSent.Rejected;
            changes.AppUserReceivedToUserStatus = UserStatus.FriendRequestReceived.Rejected;
        }
        else
        {
            changes.AppUserReceivedToUserStatus = UserStatus.FriendRequestSent.Rejected;
            changes.AppUserRequestedToUserStatus = UserStatus.FriendRequestReceived.Rejected;
        }


        var update = await _mediator.Send(
            new UpdateAppUserLinkCommand(appUser, recipientUser, changes),
            cT
        );

        if (!update)
        {
            _logger.LogError(
                "No changes made to app user link, {User}, {Recipient}",
                appUser.UserName,
                recipientUser.UserName
            );
            ThrowError("No changes made to app user link");
        }

        /*var notification = new Notification(
            recipientUser,
            appUser,
            NotificationType.FriendRequest.Rejected,
            $"New friend request from {appUser.UserName!}"
        );

        var send = await _mediator.Send(new CreateNotificationCommand(notification), cT);#1#

        _logger.LogInformation(
            "{UserName} rejected a friend request to {Recipient}",
            appUser.UserName,
            recipientUser.UserName
        );

        await SendNoContentAsync(cT);
    }
}*/