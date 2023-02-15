using System.Security.Claims;
using FastEndpoints;
using Infrastructure.Entities.Identity;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Users.API.Grpc;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Endpoints;

public class CurrentUserEndpoint : EndpointWithoutRequest<AppUser>
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