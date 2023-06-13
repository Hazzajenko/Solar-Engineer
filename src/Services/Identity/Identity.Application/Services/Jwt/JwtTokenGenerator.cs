using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Infrastructure.Logging;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Identity.Application.Services.Jwt;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private static readonly TimeSpan TokenLifetime = TimeSpan.FromHours(8);
    private readonly IDateTimeProvider _dateTimeProvider;
    private readonly JwtSettings _jwtSettings;

    public JwtTokenGenerator(IDateTimeProvider dateTimeProvider, IOptions<JwtSettings> jwtOptions)
    {
        _dateTimeProvider = dateTimeProvider;
        _jwtSettings = jwtOptions.Value;
    }

    public string GenerateToken(string id, string userName)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        // _jwtSettings.DumpObjectJson();
        var key = Encoding.UTF8.GetBytes(_jwtSettings.Key);
        // var signingCredentials = new SigningCredentials(
        //     new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key)),
        //     SecurityAlgorithms.HmacSha256
        // );

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Sub, id),
            new(JwtRegisteredClaimNames.UniqueName, userName),
            new("userName", userName)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(TokenLifetime),
            Issuer = _jwtSettings.Issuer,
            Audience = _jwtSettings.Audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };
        //
        // var securityToken = new JwtSecurityToken(
        //     _jwtSettings.Issuer,
        //     _jwtSettings.Audience,
        //     claims,
        //     expires: _dateTimeProvider.UtcNow.Add(TokenLifetime),
        //     signingCredentials: signingCredentials
        // );

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);

        // return new JwtSecurityTokenHandler().WriteToken(securityToken);
    }
}
