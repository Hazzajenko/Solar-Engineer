using Auth.API;
using FastEndpoints;
using Infrastructure.Contracts.Request;
using Mediator;
using Users.API.Grpc;

namespace Users.API.Endpoints;

public class TestGrpcEndpoint : Endpoint<UserIdRequest, AppUserResponse>
{
    private readonly IAuthGrpcGrabber _authGrpcGrabber;
    private readonly IMediator _mediator;

    public TestGrpcEndpoint(
        IMediator mediator, IAuthGrpcGrabber authGrpcGrabber)
    {
        _mediator = mediator;
        _authGrpcGrabber = authGrpcGrabber;
    }


    public override void Configure()
    {
        Get("/grpc/{@userId}", x => new { x.UserId });
        AllowAnonymous();
        // AuthSchemes("cookie");
    }

    public override async Task HandleAsync(UserIdRequest request, CancellationToken cT)
    {
        Response = await _authGrpcGrabber.GetAppUserById(request.UserId);
        await SendOkAsync(Response, cT);
        // Response.User = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        // await SendOkAsync(Response, cT);
    }
}