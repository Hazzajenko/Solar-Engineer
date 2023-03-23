using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Mediator;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Identity.Application.Handlers.Auth.Token;

public class GetTokenHandler : ICommandHandler<GetTokenCommand, string>
{
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);
    private readonly IConfiguration _config;

    public GetTokenHandler(IConfiguration config)
    {
        _config = config;
    }

    public ValueTask<string> Handle(GetTokenCommand request, CancellationToken cT)
    {
        var tokenKey = _config["TokenKey"];
        ArgumentNullException.ThrowIfNull(tokenKey);
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(tokenKey);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, request.AppUserId.ToString()),
            new("userName", request.UserName)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(TokenLifetime),
            Issuer = "https://solarengineer.app",
            Audience = "https://api.solarengineer.app",
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new ValueTask<string>(tokenHandler.WriteToken(token));
    }
}