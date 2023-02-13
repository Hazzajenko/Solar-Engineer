using System.Security.Claims;
using Auth.API;
using FastEndpoints;
using Infrastructure.Contracts.Request;
using Mediator;
using Users.API.Grpc;

namespace Users.API.Endpoints;

public class CurrentUserEndpoint : Endpoint<UserIdRequest, AppUserResponse>
{
    private readonly IAuthGrpcGrabber _authGrpcGrabber;
    private readonly IMediator _mediator;

    public CurrentUserEndpoint(
        IMediator mediator, IAuthGrpcGrabber authGrpcGrabber)
    {
        _mediator = mediator;
        _authGrpcGrabber = authGrpcGrabber;
    }


    public override void Configure()
    {
        Get("/current");
        // AllowAnonymous();
        // AllowAnonymous();
        // AuthSchemes("cookie");
    }

    public override async Task HandleAsync(UserIdRequest request, CancellationToken cT)
    {
        var user = User;
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Logger.LogInformation("User {User}", userId);
        Response = new AppUserResponse();
        // Response = await _authGrpcGrabber.GetAppUserById(request.UserId);

        await SendOkAsync(Response, cT);
        // Response.User = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        // await SendOkAsync(Response, cT);
    }
}