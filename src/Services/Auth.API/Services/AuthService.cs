using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Auth.API.Contracts.Data;
using Auth.API.Entities;
using Auth.API.Models;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace Auth.API.Services;

public interface IAuthService
{
    Task<TokenResponse> Generate(AppUser request, ExternalLogin externalLogin);
}

public class AuthService : IAuthService
{
    private readonly SymmetricSecurityKey _key;
    private readonly UserManager<AppUser> _userManager;

    public AuthService(IConfiguration config, UserManager<AppUser> userManager)
    {
        _userManager = userManager;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]!));
    }

    public async Task<TokenResponse> Generate(AppUser request, ExternalLogin externalLogin)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.NameId, request.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, request.UserName!),
            new(CustomClaims.LoginProvider, externalLogin.LoginProvider),
            new(CustomClaims.ProviderKey, externalLogin.ProviderKey)
        };

        var roles = await _userManager.GetRolesAsync(request);

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);


        return new TokenResponse
        {
            Token = tokenHandler.WriteToken(token),
            DisplayName = request.DisplayName,
            Expires = token.ValidTo
        };
    }
}