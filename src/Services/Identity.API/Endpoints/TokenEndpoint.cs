using Duende.IdentityServer.Services;
using FastEndpoints;
using Identity.API.Entities;
using IdentityModel.AspNetCore.AccessTokenManagement;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints;
// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

public class TokenEndpoint : EndpointWithoutRequest
{
    private readonly IEventService _events;

    private readonly IIdentityServerInteractionService _interaction;

    // private readonly IAuthService _authService;
    // private readonly IBus _bus;
    private readonly IMediator _mediator;
    private readonly IUserAccessTokenStore _userAccessTokenStore;
    private readonly UserManager<AppUser> _usersManager;


    public TokenEndpoint(
        IMediator mediator, UserManager<AppUser> usersManager, IIdentityServerInteractionService interaction,
        IEventService events, IUserAccessTokenStore userAccessTokenStore)
    {
        _mediator = mediator;
        _usersManager = usersManager;
        _interaction = interaction;
        _events = events;
        _userAccessTokenStore = userAccessTokenStore;
        // _authService = authService;
        // _bus = bus;
        // _publisherService = publisherService;
    }


    public override void Configure()
    {
        Get("/token");
        Policies("ApiScope");
        // AuthSchemes(JwtBearerDefaults.AuthenticationScheme);
        // AllowAnonymous();
        // AuthSchemes("google");
        // PreProcessors(new SecurityHeadersProcessor());
        // AuthSchemes(IdentityServerConstants.ExternalCookieAuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var token = await HttpContext.GetTokenAsync("access_token");
        // Logger.LogInformation("Token {Token}", token);
        var token2 = await _userAccessTokenStore.GetTokenAsync(User);
        Logger.LogInformation("Token {@Token}", token2);
        // ctx.User.GetT
        // var token = 
        // await _userAccessTokenStore.StoreTokenAsync()
        var res = User.Claims.Select(x => new { x.Type, x.Value }).ToList();
        await SendOkAsync(res, cT);
    }
}