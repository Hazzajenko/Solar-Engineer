using Auth.API.Contracts.Responses;
using Auth.API.Extensions;
using Auth.API.Handlers;
using Auth.API.Services;
using EventBus.Mapping;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authentication.Cookies;
// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IAuthService _authService;
    private readonly IMediator _mediator;
    private readonly IBus _bus;


    public AuthorizeEndpoint(
        IMediator mediator, IAuthService authService, IBus bus)
    {
        _mediator = mediator;
        _authService = authService;
        _bus = bus;
    }


    public override void Configure()
    {
        Get("/authorize");
        AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = await _authService.Generate(appUser, HttpContext.User.GetLogin());
        
        Uri uri1 = new Uri("rabbitmq://localhost/appUserLoggedIn-Users");
        Uri uri2 = new Uri("rabbitmq://localhost/appUserLoggedIn-Messages");
        var endPoint1 = await _bus.GetSendEndpoint(uri1);
        var endPoint2 = await _bus.GetSendEndpoint(uri2);
        await endPoint1.Send(appUser.ToEvent().LoggedIn(), cT);
        await endPoint2.Send(appUser.ToEvent().LoggedIn(), cT);

        Response.Token = token.Token;

        await SendOkAsync(Response, cT);
    }
}