using Auth.API.Commands;
using Auth.API.Contracts.Responses;
using Auth.API.Mapping;
using Auth.API.Services;
using Mediator;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Auth.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IAuthService _authService;
    private readonly IMediator _mediator;

    public AuthorizeEndpoint(
        IMediator mediator, IAuthService authService)
    {
        _mediator = mediator;
        _authService = authService;
    }


    public override void Configure()
    {
        Get("/authorize");
        AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = await _authService.Generate(appUser);
        Response.User = appUser.ToCurrentUserDto();
        Response.Token = token.Token;

        await SendOkAsync(Response, cT);
    }
}