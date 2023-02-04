using dotnetapi.Features.Users.Contracts.Responses;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class GetAppUserLinksEndpoint : EndpointWithoutRequest<GetAppUserLinksResponse>
{
    private readonly ILogger<GetAppUserLinksEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetAppUserLinksEndpoint(
        ILogger<GetAppUserLinksEndpoint> logger,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("users/links");
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

        Response.AppUserLinks = await _mediator.Send(new GetAppUserToUserDtosByAppUserQuery(appUser), cT);

        await SendOkAsync(Response, cT);
    }
}