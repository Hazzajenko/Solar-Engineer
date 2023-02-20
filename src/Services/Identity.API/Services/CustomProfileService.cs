using System.Security.Claims;
using Duende.IdentityServer.Extensions;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Identity.API.Entities;
using IdentityModel;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Services;

public class CustomProfileService : IProfileService
{
    private readonly IUserClaimsPrincipalFactory<AppUser> _userClaimsPrincipalFactory;

    private readonly UserManager<AppUser> _userMgr;
    // private readonly RoleManager<IdentityRole> _roleMgr;

    public CustomProfileService(
        UserManager<AppUser> userMgr,
        // RoleManager<IdentityRole> roleMgr,
        IUserClaimsPrincipalFactory<AppUser> userClaimsPrincipalFactory)
    {
        _userMgr = userMgr;
        // _roleMgr = roleMgr;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
    }


    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var sub = context.Subject.GetSubjectId();
        var user = await _userMgr.FindByIdAsync(sub) ?? throw new ArgumentNullException(nameof(AppUser));

        var userClaims = await _userClaimsPrincipalFactory.CreateAsync(user);

        var claims = userClaims.Claims.ToList();
        claims = claims.Where(u => context.RequestedClaimTypes.Contains(u.Type)).ToList();
        claims.Add(new Claim(JwtClaimTypes.Name, user.FirstName));
        /*if (_userMgr.SupportsUserRole)
        {
            IList<string> roles = await _userMgr.GetRolesAsync(user);
            foreach (var rolename in roles)
            {
                claims.Add(new Claim(JwtClaimTypes.Role, rolename));
            }
        }*/

        context.IssuedClaims = claims;
    }

    public async Task IsActiveAsync(IsActiveContext context)
    {
        var sub = context.Subject.GetSubjectId();
        var user = await _userMgr.FindByIdAsync(sub);
        context.IsActive = user != null;
        // return context.IsActive;
    }
}