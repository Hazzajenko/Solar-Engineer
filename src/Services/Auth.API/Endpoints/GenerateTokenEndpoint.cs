using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Auth.API.Contracts.Responses;
using Auth.API.Services;
using EventBus.Services;
using FastEndpoints;
using Infrastructure.Authentication;
using Mediator;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

// using Auth.API.RabbitMQ;

// using MassTransit.Mediator;

namespace Auth.API.Endpoints;

public class GenerateTokenEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IAuthService _authService;
    private readonly IBus _bus;

    private readonly IMediator _mediator;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IEventPublisherService _publisherService;
    private readonly byte[] _tokenKey;


    public GenerateTokenEndpoint(IConfiguration config,
        IMediator mediator, IAuthService authService, IBus bus, IEventPublisherService publisherService,
        IPublishEndpoint publishEndpoint /*,
        IPublishEndpoint publishEndpoint*/)
    {
        _mediator = mediator;
        _authService = authService;
        _bus = bus;
        _publisherService = publisherService;
        _publishEndpoint = publishEndpoint;
        _tokenKey = Encoding.UTF8.GetBytes(config["TokenKey"]!);
        // _publishEndpoint = publishEndpoint;
    }


    public override void Configure()
    {
        Get("/token");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.NameId, "admin"),
            new(JwtRegisteredClaimNames.UniqueName, "admin"),
            new(CustomClaims.LoginProvider, "admin"),
            new(CustomClaims.ProviderKey, "admin")
        };

        // var roles = await _userManager.GetRolesAsync(request);
        // var k = Encoding.UTF8.GetBytes(config["TokenKey"]!);
        // claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        var key = new SymmetricSecurityKey(_tokenKey);
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        await SendOkAsync(new AuthorizeResponse { Token = tokenHandler.WriteToken(token) }, cT);
    }
}