using Duende.IdentityServer.Extensions;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Identity.API.Entities;
using IdentityModel;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Services;

public class CustomProfileService : IProfileService
{
    private readonly ILogger<CustomProfileService> _logger;
    private readonly IUserClaimsPrincipalFactory<AppUser> _userClaimsPrincipalFactory;

    private readonly UserManager<AppUser> _userMgr;
    // private readonly RoleManager<IdentityRole> _roleMgr;

    public CustomProfileService(
        UserManager<AppUser> userMgr,
        // RoleManager<IdentityRole> roleMgr,
        IUserClaimsPrincipalFactory<AppUser> userClaimsPrincipalFactory, ILogger<CustomProfileService> logger)
    {
        _userMgr = userMgr;
        // _roleMgr = roleMgr;
        _userClaimsPrincipalFactory = userClaimsPrincipalFactory;
        _logger = logger;
    }


    public virtual Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        _logger.LogInformation("GetProfileDataAsync");
        if (context.Subject.GetAuthenticationMethod() == OidcConstants.GrantTypes.TokenExchange)
        {
            var act = context.Subject.FindFirst(JwtClaimTypes.Actor);
            if (act != null) context.IssuedClaims.Add(act);
        }

        var sub = context.Subject.GetSubjectId();
        // var user = await _userMgr.FindByIdAsync(sub) ?? throw new ArgumentNullException(nameof(AppUser));

        // var userClaims = await _userClaimsPrincipalFactory.CreateAsync(user);

        /*var claims = userClaims.Claims.ToList();
        claims = claims.Where(u => context.RequestedClaimTypes.Contains(u.Type)).ToList();
        claims.Add(new Claim(JwtClaimTypes.Name, user.FirstName));*/
        /*if (_userMgr.SupportsUserRole)
        {
            IList<string> roles = await _userMgr.GetRolesAsync(user);
            foreach (var rolename in roles)
            {
                claims.Add(new Claim(JwtClaimTypes.Role, rolename));
            }
        }*/

        // context.IssuedClaims = claims;
        return Task.CompletedTask;
    }

    public virtual Task IsActiveAsync(IsActiveContext context)
    {
        _logger.LogInformation("IsActiveAsync");
        context.IsActive = true;
        return Task.CompletedTask;
        /*var sub = context.Subject.GetSubjectId();
        var user = await _userMgr.FindByIdAsync(sub);
        context.IsActive = user != null;*/

        // context.IsActive = true;
        // return context.IsActive;
    }
}