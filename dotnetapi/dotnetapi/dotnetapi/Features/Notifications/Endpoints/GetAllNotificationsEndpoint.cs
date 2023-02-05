using dotnetapi.Features.Notifications.Contracts.Responses;
using dotnetapi.Features.Notifications.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Notifications.Endpoints;

[Authorize]
public class GetAllNotificationsEndpoint : EndpointWithoutRequest<AllNotificationsResponse>
{
    private readonly ILogger<GetAllNotificationsEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetAllNotificationsEndpoint(
        ILogger<GetAllNotificationsEndpoint> logger,
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
        Get("/notifications");
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

        Response.Notifications = await _mediator.Send(new GetNotificationsQuery(appUser), cT);

        await SendOkAsync(Response, cT);
    }
}