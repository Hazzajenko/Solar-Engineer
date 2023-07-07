using ApplicationCore.Entities;
using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Logging;
using Identity.Application.Mapping;
using Identity.Contracts.Responses;
using Identity.Domain;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints.Users;

public class GetCurrentUserEndpoint : EndpointWithoutRequest<UserResponse>
{
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetCurrentUserEndpoint(IMediator mediator, UserManager<AppUser> userManager)
    {
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/user");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        AppUser? appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            NonAuthenticatedUser nonAuthUser = User.TryGetUserIdAndName();
            Logger.LogUserNotFound(nonAuthUser.UserId, nonAuthUser.UserName);
            await SendUnauthorizedAsync(cT);
            return;
        }

        Response.User = appUser.ToCurrentUserDto();
        await SendOkAsync(Response, cT);
    }
}
