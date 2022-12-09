using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Services;

public class UsersService: IUsersService
{
    private readonly SymmetricSecurityKey _key;
    private readonly UserManager<AppUser> _userManager;
    
    public UsersService(IConfiguration config, UserManager<AppUser> userManager) {
        _userManager = userManager;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]!));
    }
    /*private readonly SymmetricSecurityKey _key;
    private readonly UserManager<AppUser> _userManager;*/
    /*public TokenService(IConfiguration config, UserManager<AppUser> userManager)
    {
        _userManager = userManager;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }*/

    /*public async Task<string> CreateToken(AppUser user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!),
        };

        var roles = await _userManager.GetRolesAsync(user);

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }*/
    public async Task<AppUserDto> HandleSignIn(AppUser request)
    {
        var claims = new List<Claim> {
            new(JwtRegisteredClaimNames.NameId, request.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, request.UserName!)
        };

        var roles = await _userManager.GetRolesAsync(request);

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new AppUserDto {
            Username = request.UserName!,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl,
            Created = request.Created,
            Email = request.Email!,
            LastActive = request.LastActive,
            Token = tokenHandler.WriteToken(token)
        };
    }
}