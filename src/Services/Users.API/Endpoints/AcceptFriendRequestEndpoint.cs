using FastEndpoints;
using Mediator;
using Users.API.Contracts.Requests;

namespace Users.API.Endpoints;

public class AcceptFriendRequestEndpoint : Endpoint<AcceptFriendRequestRequest>
{
    private readonly IMediator _mediator;

    public AcceptFriendRequestEndpoint(
        IMediator mediator
    )
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Put("/users/{@username}/accept", x => new { x.UserName });
    }

    public override async Task HandleAsync(AcceptFriendRequestRequest request, CancellationToken cT)
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

        var changes = new AppUserLinkChanges
        {
            UserToUserStatus = UserToUserStatus.Approved,
            Friends = true,
            BecameFriendsTime = DateTime.Now
            // AppUserReceivedToUserStatus = UserStatus.
        };

        var isAppUserRequested = appUserLink.AppUserRequested.UserName == appUser.UserName!;
        if (isAppUserRequested)
        {
            changes.AppUserRequestedToUserStatus = UserStatus.FriendRequestSent.Accepted;
            changes.AppUserReceivedToUserStatus = UserStatus.FriendRequestReceived.Accepted;
        }
        else
        {
            changes.AppUserReceivedToUserStatus = UserStatus.FriendRequestSent.Accepted;
            changes.AppUserRequestedToUserStatus = UserStatus.FriendRequestReceived.Accepted;
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
            NotificationType.FriendRequest.Accepted,
            $"{appUser.UserName!} has accepted your friend request!"
        );

        var send = await _mediator.Send(new CreateNotificationCommand(notification), cT);

        _logger.LogInformation(
            "{User} accepted a friend request from {Recipient}",
            appUser.UserName,
            recipientUser.UserName
        );

        await SendNoContentAsync(cT);*/
    }
}