using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Services.Auth;

public class AuthService : IAuthService
{
    private readonly SymmetricSecurityKey _key;
    private readonly UserManager<AppUser> _userManager;

    public AuthService(IConfiguration config, UserManager<AppUser> userManager)
    {
        _userManager = userManager;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]!));
    }

    public async Task<LoginResponse> HandleSignIn(AppUser request)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.NameId, request.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, request.UserName!)
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

        return new LoginResponse
        {
            Username = request.UserName!,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl,
            Created = request.Created,
            Email = request.Email!,
            Token = tokenHandler.WriteToken(token)
        };
    }
}