using dotnetapi.Features.Users.Contracts.Requests;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class UpdateAppUserLinkStatusEndpoint : Endpoint<UpdateAppUserLinkStatusRequest>
{
    private readonly ILogger<UpdateAppUserLinkStatusEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public UpdateAppUserLinkStatusEndpoint(
        ILogger<UpdateAppUserLinkStatusEndpoint> logger,
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
        Put("/users/{@username}/status", x => new { x.UserName });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdateAppUserLinkStatusRequest request, CancellationToken cT)
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

        var update = await _mediator.Send(
            new UpdateAppUserLinkStatusCommand(appUser, recipientUser, request.Status),
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
            "{User} updated App User Link with {Recipient}, with {Data}",
            appUser.UserName,
            recipientUser.UserName,
            request.Status
        );

        await SendNoContentAsync(cT);
    }
}