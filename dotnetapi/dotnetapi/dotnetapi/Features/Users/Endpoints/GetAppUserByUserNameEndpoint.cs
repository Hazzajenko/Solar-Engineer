using dotnetapi.Features.Users.Contracts.Responses;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
// [Time]
public class GetAppUserByUserNameEndpoint : EndpointWithoutRequest<GetUserLinkResponse>
{
    private readonly ILogger<GetAppUserByUserNameEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetAppUserByUserNameEndpoint(
        ILogger<GetAppUserByUserNameEndpoint> logger,
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
        Get("v2/user/{username}");
        Policies("BeAuthenticated");
        // Roles("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var recipientUserName = Route<string>("username");
        if (string.IsNullOrEmpty(recipientUserName))
            ThrowError("Invalid username");

        var appUserToUser = await _mediator.Send(
            new GetAppUserToUserByUserNameQuery(appUser, recipientUserName),
            cT
        );
        if (appUserToUser is null)
        {
            _logger.LogError("appUserToUser is invalid");
            ThrowError("appUserToUser is invalid");
        }

        Response.User = appUserToUser;

        await SendOkAsync(Response, cT);
    }
}