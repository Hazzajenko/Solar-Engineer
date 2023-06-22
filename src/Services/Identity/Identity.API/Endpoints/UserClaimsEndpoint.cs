using FastEndpoints;
using Infrastructure.Logging;
using Mediator;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Identity.API.Endpoints;

public class UserClaimsEndpoint : EndpointWithoutRequest
{
    private readonly IMediator _mediator;

    public UserClaimsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/claims");
        // AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        // AllowAnonymous();
        // AuthSchemes("bearer");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = User!;
        user.DumpObjectJson();
        await SendOkAsync(user, cT);
    }
}
