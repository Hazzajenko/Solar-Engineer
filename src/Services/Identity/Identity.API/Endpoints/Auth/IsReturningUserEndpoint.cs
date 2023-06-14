using FastEndpoints;
using Identity.Application.Handlers.AppUsers.GetAppUserDto;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Contracts.Events;
using Infrastructure.Extensions;
using Mapster;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints.Auth;

public class IsReturningUserEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IBus _bus;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public IsReturningUserEndpoint(
        IMediator mediator,
        IJwtTokenGenerator jwtTokenGenerator,
        IBus bus,
        UserManager<AppUser> userManager
    )
    {
        _mediator = mediator;
        _jwtTokenGenerator = jwtTokenGenerator;
        _bus = bus;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/returning-user");
        AuthSchemes("bearer");
        Summary(x =>
        {
            x.Summary = "Check if user is returning";
            x.Description = "Check if user is returning";
            x.Response<AuthorizeResponse>(200, "Success");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _userManager.GetUserAsync(User);
        // var appUser = await _mediator.Send(new GetAppUserDtoQuery(User), cT);
        if (appUser is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendRedirectAsync("/auth/login/google", cancellation: cT);
            return;
        }

        var token = _jwtTokenGenerator.GenerateToken(appUser.Id, appUser.UserName);

        var message = new UserLoggedIn(
            appUser.Id,
            appUser.UserName,
            appUser.DisplayName,
            appUser.PhotoUrl
        );
        await _bus.Publish(message, cT);

        var user = appUser.Adapt<AppUserDto>();

        Response.Token = token;
        Response.User = user;
        await SendOkAsync(Response, cT);
    }
}
