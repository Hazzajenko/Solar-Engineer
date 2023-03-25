using FastEndpoints;
using Identity.Application.Handlers.AppUsers.GetAppUserDto;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Responses;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.API.Endpoints.Auth;

public class IsReturningUserEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMediator _mediator;

    public IsReturningUserEndpoint(IMediator mediator, IJwtTokenGenerator jwtTokenGenerator)
    {
        _mediator = mediator;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public override void Configure()
    {
        Post("/auth/returning-user");
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
        var appUser = await _mediator.Send(new GetAppUserDtoQuery(User), cT);
        if (appUser is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendRedirectAsync("/auth/login/google", cancellation: cT);
            return;
        }

        var token = _jwtTokenGenerator.GenerateToken(appUser.Id, appUser.UserName);

        /*var token = await _mediator.Send(
            new GetTokenCommand(appUser.Id.ToGuid(), appUser.UserName),
            cT
        );*/
        Response.Token = token;
        Response.User = appUser;
        await SendOkAsync(Response, cT);
    }
}