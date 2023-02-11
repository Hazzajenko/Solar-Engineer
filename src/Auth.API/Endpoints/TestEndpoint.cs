using Mediator;

namespace Auth.API.Endpoints;

// [Authorize]
public class TestEndpoint : EndpointWithoutRequest<string>
{
    private readonly IMediator _mediator;

    public TestEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }


    public override void Configure()
    {
        Get("/test");
        AllowAnonymous();
        // PermissionsAll("read:current_user");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // AppUser appUser = await _mediator.Send(new LoginCommand(User), cT);
        /*ctx.GetTokenAsync("access_token");
        return ctx.User.Claims.Select(x => new { x.Type, x.Value }).ToList();*/
        Response = "hello";
        await SendOkAsync(Response, cT);
    }
}