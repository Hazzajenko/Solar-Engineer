using System.IdentityModel.Tokens.Jwt;
using dotnetapi.Features.Users.Entities;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Http;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class AuthCurrentUserEndpoint : EndpointWithoutRequest<Auth0UserDto>
{
    private readonly IHttpClientFactoryService _httpClientFactoryService;
    private readonly UserManager<AppUser> _userManager;

    public AuthCurrentUserEndpoint(
        UserManager<AppUser> userManager,
        IHttpClientFactoryService httpClientFactoryService
    )
    {
        _userManager = userManager;
        _httpClientFactoryService = httpClientFactoryService;
    }

    public override void Configure()
    {
        Get("/account/profile");
        // AllowAnonymous();
        // PermissionsAll("read:current_user");
        // PermissionsAll("read:messages");
        // PermissionsAll("Profile_Read", "Profile_Update");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var accessToken = await HttpContext.GetTokenAsync("Bearer");
        // var me = HttpContext.Request.Headers.Authorization;
        // me = me.ToString().Replace("Bearer ", "");
        // var token1 = new JwtSecurityToken(me);
        /*foreach (var prop in token1.GetType().GetProperties())
        {
            var type = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
            Logger.LogInformation("{@Prop}", type);
            Logger.LogInformation("{@Prop}", prop.GetValue(token1, null)!.ToString());
            /*if (type == typeof (DateTime))
            {
                Console.WriteLine(prop.GetValue(car, null).ToString());
            }#1#
        }*/

        // Logger.LogInformation("accessToken {AccessToken}", accessToken);
        // var userName = User.Identity?.Name;
        // Logger.LogInformation("UserName {UserName}", userName);
        var user = HttpContext.User;
        Logger.LogInformation("USER {@User}", user);
        string authHeader = HttpContext.Request.Headers.Authorization!;
        // Logger.LogInformation("AuthHeader {@AuthHeader}", authHeader);
        authHeader = authHeader.Replace("Bearer ", "");
        var claims = User;
        // var jsonToken = handler.ReadToken(authHeader);
        // var tokenS = handler.ReadToken(authHeader) as JwtSecurityToken;
        // var id = tokenS.Claims.First(claim => claim.Type == "nameid").Value;
        var token = new JwtSecurityToken(authHeader);
        var sub = token.Subject;
        // Logger.LogInformation("Token {@Token}", token);
        // string expiry = token.Claims.First(c => c.Type == "expiry").Value;
        // return expiry;
        // var sub = Route<string>("sub");
        if (sub.IsNullOrEmpty())
            ThrowError("Invalid sub");
        // var authUser2 = await _httpClientFactoryService.GetHttpData<Auth0User>("users", sub);
        var authUser = await _httpClientFactoryService.GetAuthUser(sub!);
        if (authUser is null)
        {
            Logger.LogError("User is null");
            ThrowError("User is null");
        }

        await SendOkAsync(authUser!, cT);
    }
}