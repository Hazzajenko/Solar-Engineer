using dotnetapi.Features.Users.Contracts.Responses;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Features.Users.Handlers.Friends;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class GetUsersQueryEndpoint : EndpointWithoutRequest<GetAppUserLinksResponse>
{
    private readonly ILogger<GetUsersQueryEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetUsersQueryEndpoint(
        ILogger<GetUsersQueryEndpoint> logger,
        IMediator mediator,
        UserManager<AppUser> userManager
    )
    {
        _logger = logger;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("users");
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

        var filter = Query<string>("filter", false);

        if (filter is "friends")
        {
            Response.AppUserLinks = await _mediator.Send(
                new GetAppUserLinkFriendsQuery(appUser),
                cT
            );
            await SendOkAsync(Response, cT);
            return;
        }

        Response.AppUserLinks = await _mediator.Send(
            new GetAppUserToUserDtosByAppUserQuery(appUser),
            cT
        );

        await SendOkAsync(Response, cT);
    }
}