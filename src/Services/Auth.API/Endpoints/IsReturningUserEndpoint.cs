using Auth.API.Contracts.Responses;
using Auth.API.Handlers;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;

namespace Auth.API.Endpoints;

public class IsReturningUserEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IMediator _mediator;

    public IsReturningUserEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/returning-user");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var appUser = await _mediator.Send(new GetAppUserQuery(User), cT);
        if (appUser is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendRedirectAsync("/auth/login/google", cancellation: cT);
            // await SendUnauthorizedAsync(cT);
            return;
        }

        // appUser.UserName.Thr
        ArgumentNullException.ThrowIfNull(appUser.UserName);

        var token = await _mediator.Send(new GetTokenCommand(appUser.Id, appUser.UserName), cT);
        Response.Token = token;
        await SendOkAsync(Response, cT);
    }
}