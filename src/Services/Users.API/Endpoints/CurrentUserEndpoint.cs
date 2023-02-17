using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Users.API.Grpc;
// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Endpoints;

public class CurrentUserEndpoint : EndpointWithoutRequest
{
    private readonly IAuthGrpcService _authGrpcService;
    private readonly IMediator _mediator;

    public CurrentUserEndpoint(
        IMediator mediator, IAuthGrpcService authGrpcService)
    {
        _mediator = mediator;
        _authGrpcService = authGrpcService;
    }


    public override void Configure()
    {
        Get("/current");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        Response = await _authGrpcService.GetAppUserById(User.GetUserId());
        await SendOkAsync(Response, cT);
    }
}