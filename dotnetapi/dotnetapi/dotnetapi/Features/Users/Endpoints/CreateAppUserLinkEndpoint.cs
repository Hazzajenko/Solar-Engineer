using dotnetapi.Features.Users.Contracts.Requests;
using dotnetapi.Features.Users.Contracts.Responses;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class CreateAppUserLinkEndpoint
    : Endpoint<CreateAppUserLinkRequest, CreateAppUserLinkResponse>
{
    private readonly ILogger<CreateAppUserLinkEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public CreateAppUserLinkEndpoint(
        ILogger<CreateAppUserLinkEndpoint> logger,
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
        Post("users/{@userName}", x => new { x.UserName });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateAppUserLinkRequest request, CancellationToken cT)
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
            _logger.LogError("recipientUser {User} is invalid", request.UserName);
            ThrowError("recipientUser is invalid");
        }

        var entity = request.ToEntity(appUser, recipientUser);

        Response.AppUserLink = await _mediator.Send(new CreateAppUserLinkCommand(entity), cT);

        _logger.LogInformation(
            "User {AppUser} created a link with user {User}",
            appUser.UserName,
            recipientUser.UserName
        );

        await SendOkAsync(Response, cT);
    }
}