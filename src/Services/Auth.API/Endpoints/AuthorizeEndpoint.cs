using Auth.API.Contracts.Responses;
using Auth.API.Entities;
using Auth.API.Extensions;
using Auth.API.Handlers;
using Auth.API.Services;
using Duende.IdentityServer.Extensions;
using EventBus.Mapping;
using EventBus.Services;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authentication.Cookies;

// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthUser>
{
    private readonly IAuthService _authService;

    private readonly IBus _bus;

    // private readonly IExtensionGrantValidator _grantValidator;
    private readonly IMediator _mediator;
    private readonly IEventPublisherService _publisherService;


    public AuthorizeEndpoint(
        IMediator mediator, IAuthService authService, IBus bus, IEventPublisherService publisherService)
    {
        _mediator = mediator;
        _authService = authService;
        _bus = bus;
        _publisherService = publisherService;
        // _grantValidator = grantValidator;
    }


    public override void Configure()
    {
        Get("/authorize");
        // AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        bool val1 = (User != null) &&
                    (User.Identity.IsAuthenticated) &&
                    (User.Identity.AuthenticationType.ToString() == "Forms");
        if (val1)
        {
            Logger.LogInformation("IsAuthenticated");
        }
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        // var token = await _authService.Generate(appUser, HttpContext.User.GetLogin());

        // var request = appUser.ToEvent().LoggedIn();
        // await _publisherService.PublishAsync(request);

        /*Uri uri1 = new Uri("rabbitmq://localhost/appUserLoggedIn-Users");
        Uri uri2 = new Uri("rabbitmq://localhost/appUserLoggedIn-Messages");
        var endPoint1 = await _bus.GetSendEndpoint(uri1);
        var endPoint2 = await _bus.GetSendEndpoint(uri2);
        await endPoint1.Send(appUser.ToEvent().LoggedIn(), cT);
        await endPoint2.Send(appUser.ToEvent().LoggedIn(), cT);*/

        // Response.Token = token.Token;

        await SendOkAsync(appUser, cT);
    }
}