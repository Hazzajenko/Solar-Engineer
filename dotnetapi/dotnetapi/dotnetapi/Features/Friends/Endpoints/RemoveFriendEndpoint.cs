using dotnetapi.Features.Friends.Contracts.Responses;
using dotnetapi.Features.Friends.Handlers;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Friends.Endpoints;

[Authorize]
public class RemoveFriendEndpoint : EndpointWithoutRequest<RemoveFriendResponse>
{
    private readonly ILogger<RemoveFriendEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public RemoveFriendEndpoint(
        ILogger<RemoveFriendEndpoint> logger,
        UserManager<AppUser> userManager,
        IMediator mediator)
    {
        _logger = logger;
        _userManager = userManager;
        _mediator = mediator;
    }

    public override void Configure()
    {
        Delete("/friend/{username}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var friendUserName = Route<string>("username");
        if (string.IsNullOrEmpty(friendUserName)) ThrowError("No username given");

        var friendUser = await _mediator.Send(new GetUserByUserNameQuery(friendUserName), cT);
        if (friendUser is null)
        {
            _logger.LogError("Bad request, friendUser is invalid");
            ThrowError("friendUser is invalid");
        }


        var appUserFriend = await _mediator.Send(new GetAppUserFriendQuery(appUser, friendUser), cT);
        if (appUserFriend is null)
        {
            _logger.LogError("Bad request, appUserFriend is invalid");
            ThrowError("appUserFriend is invalid");
        }
        

        var deleted = await _mediator.Send(new DeleteAppUserFriendQuery(appUserFriend), cT);


        var result = new RemoveFriendResponse
        {
            FriendRemoved = deleted
        };

        _logger.LogInformation("{UserName} removed friend {FriendUserName}", appUser.UserName,
            friendUserName);

        await SendOkAsync(result, cT);
    }
}