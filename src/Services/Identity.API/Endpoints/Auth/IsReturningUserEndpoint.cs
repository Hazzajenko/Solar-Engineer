using FastEndpoints;
using Identity.Application.Handlers.AppUsers.GetAppUserDto;
using Identity.Application.Handlers.Auth.Token;
using Identity.Contracts.Responses;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.API.Endpoints.Auth;

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
        var appUser = await _mediator.Send(new GetAppUserDtoQuery(User), cT);
        if (appUser is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendRedirectAsync("/auth/login/google", cancellation: cT);
            return;
        }


        var token = await _mediator.Send(new GetTokenCommand(appUser.Id.ToGuid(), appUser.UserName), cT);
        Response.Token = token;
        Response.User = appUser;
        await SendOkAsync(Response, cT);
    }
}