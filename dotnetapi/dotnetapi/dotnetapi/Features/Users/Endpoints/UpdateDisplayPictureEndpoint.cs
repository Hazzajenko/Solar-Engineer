using dotnetapi.Contracts.Responses;
using dotnetapi.Features.Users.Contracts.Requests;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class UpdateDisplayPictureEndpoint : Endpoint<UpdateDisplayPictureRequest, OneUpdateResponse>
{
    private readonly ILogger<UpdateDisplayPictureEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public UpdateDisplayPictureEndpoint(
        ILogger<UpdateDisplayPictureEndpoint> logger,
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
        Put("users/{@userName}/dp", x => new { x.UserName });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(
        UpdateDisplayPictureRequest request,
        CancellationToken cT
    )
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var update = await _mediator.Send(
            new UpdateDisplayPictureQuery(appUser, request.Image),
            cT
        );
        if (!update)
        {
            _logger.LogError("Unable to update user {User} display picture", appUser.UserName!);
            ThrowError("Unable to update user display picture");
        }

        await SendNoContentAsync(cT);
    }
}