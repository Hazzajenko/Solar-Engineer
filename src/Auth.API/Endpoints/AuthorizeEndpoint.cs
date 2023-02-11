using Auth.API.Commands;
using Auth.API.Contracts.Responses;
using Auth.API.Mapping;
using Mediator;

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
        AuthSchemes("cookie");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        Response.User = appUser.ToCurrentUserDto();
        await SendOkAsync(Response, cT);
    }
}