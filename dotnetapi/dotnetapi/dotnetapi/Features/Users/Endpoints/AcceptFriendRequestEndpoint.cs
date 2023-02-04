using dotnetapi.Features.Users.Contracts.Requests;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class AcceptFriendRequestEndpoint : Endpoint<AcceptFriendRequestRequest>
{
    private readonly ILogger<AcceptFriendRequestEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public AcceptFriendRequestEndpoint(
        ILogger<AcceptFriendRequestEndpoint> logger,
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
        Put("/users/{@username}/accept", x => new { x.UserName });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(AcceptFriendRequestRequest request, CancellationToken cT)
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

        var changes = new AppUserLinkChanges
            { UserToUserStatus = UserToUserStatus.Approved, Friends = true, BecameFriendsTime = DateTime.Now };

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

        _logger.LogInformation(
            "{User} accepted a friend request from {Recipient}",
            appUser.UserName,
            recipientUser.UserName
        );

        await SendNoContentAsync(cT);
    }
}