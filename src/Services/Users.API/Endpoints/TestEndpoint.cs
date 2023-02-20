using FastEndpoints;
using IdentityModel.Client;
using Mediator;
using Users.API.Grpc;

// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Endpoints;

public class TestEndpoint : EndpointWithoutRequest
{
    // private readonly IAuthGrpcService _authGrpcService;
    private readonly IMediator _mediator;

    public TestEndpoint(
        IMediator mediator, IAuthGrpcService authGrpcService)
    {
        _mediator = mediator;
        // _authGrpcService = authGrpcService;
    }


    public override void Configure()
    {
        Get("/test");
        Policies("ApiScope");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // Response = await _authGrpcService.GetAppUserById(User.GetUserId());
        var user = User;
        var token = HttpContext.Request.Headers.Authorization.ToString().Split(" ")[1];
        Response = HttpContext.User.Claims.Select(x => new { x.Type, x.Value }).ToList();
        var client = new HttpClient();
        var metaDataResponse = await client.GetDiscoveryDocumentAsync("https://localhost:6006", cT);
        var response = await client.GetUserInfoAsync(new UserInfoRequest
        {
            Address = metaDataResponse.UserInfoEndpoint,
            Token = token
        }, cT);
        if (response.IsError)
            Logger.LogError("Problem while fetching data from the UserInfo endpoint {E}", response.Exception);
        // throw new Exception("Problem while fetching data from the UserInfo endpoint", response.Exception);
        await SendOkAsync(Response, cT);
    }
}