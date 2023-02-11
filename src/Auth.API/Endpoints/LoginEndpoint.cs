using Auth.API.Commands;
using Auth.API.Contracts.Responses;
using Auth.API.Mapping;
using Mediator;
using Microsoft.AspNetCore.Authorization;

namespace Auth.API.Endpoints;

[Authorize]
public class LoginEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IMediator _mediator;

    public LoginEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }


    public override void Configure()
    {
        Post("/auth0/login");
        PermissionsAll("read:current_user");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _mediator.Send(new LoginCommand(User), cT);

        Response.User = appUser.ToCurrentUserDto();
        await SendOkAsync(Response, cT);
    }
}