using FastEndpoints;
using Infrastructure.Contracts.Request;
using Mediator;
using Microsoft.AspNetCore.Authorization;

namespace Users.API.Endpoints;

[Authorize]
public class SendFriendRequestEndpoint : Endpoint<UserIdRequest>
{
    private readonly ILogger<SendFriendRequestEndpoint> _logger;
    private readonly IMediator _mediator;

    public SendFriendRequestEndpoint(
        ILogger<SendFriendRequestEndpoint> logger,
        IMediator mediator
    )
    {
        _logger = logger;
        _mediator = mediator;
    }

    public override void Configure()
    {
        Put("/users/{@username}/add", x => new { UserName = x.UserId });
        // Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UserIdRequest request, CancellationToken cT)
    {
        /*var appUser = await _userManager.GetUserAsync(User);
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
        var statusChanges = new AppUserLinkStatusChanges();
        // var appUserInLink = appUserLink.AppUserRequested == appUser ? appUserLink.AppUserRequested : appUserLink.AppUserReceived;

        var changes = new AppUserLinkChanges { UserToUserStatus = UserToUserStatus.Pending };
        var isAppUserRequested = appUserLink.AppUserRequested.UserName == appUser.UserName!;
        if (isAppUserRequested)
        {
            changes.AppUserRequestedToUserStatus = UserStatus.FriendRequestSent.Pending;
            changes.AppUserReceivedToUserStatus = UserStatus.FriendRequestReceived.Pending;
        }
        else
        {
            changes.AppUserReceivedToUserStatus = UserStatus.FriendRequestSent.Pending;
            changes.AppUserRequestedToUserStatus = UserStatus.FriendRequestReceived.Pending;
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

        var notification = new Notification(
            recipientUser,
            appUser,
            NotificationType.FriendRequest.Sent,
            $"New friend request from {appUser.UserName!}"
        );

        var send = await _mediator.Send(new CreateNotificationCommand(notification), cT);

        _logger.LogInformation(
            "{UserName} sent a friend request to {FriendUserName}",
            appUser.UserName,
            recipientUser.UserName
        );*/

        await SendNoContentAsync(cT);
    }
}