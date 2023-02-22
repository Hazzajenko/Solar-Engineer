using Auth.API.Contracts.Responses;
using Auth.API.Handlers;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Auth.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IMediator _mediator;

    public AuthorizeEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }


    public override void Configure()
    {
        Get("/authorize");
        AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = await _mediator.Send(new GetTokenCommand(appUser.Id), cT);
        Response.Token = token;
        await SendOkAsync(Response, cT);
    }
}