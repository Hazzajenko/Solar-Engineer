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
public class AuthAccountEndpoint : EndpointWithoutRequest<Auth0User>
{
    private readonly IHttpClientFactoryService _httpClientFactoryService;
    private readonly UserManager<AppUser> _userManager;

    public AuthAccountEndpoint(
        UserManager<AppUser> userManager,
        IHttpClientFactoryService httpClientFactoryService
    )
    {
        _userManager = userManager;
        _httpClientFactoryService = httpClientFactoryService;
    }

    public override void Configure()
    {
        Get("/account/profile/{sub}");
        AllowAnonymous();
        // PermissionsAll("read:messages");
        // PermissionsAll("Profile_Read", "Profile_Update");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var user = HttpContext.User;
        // Logger.LogInformation("USER {@User}", user);
        string authHeader = HttpContext.Request.Headers["Authorization"]!;
        Logger.LogInformation("AuthHeader {@AuthHeader}", authHeader);
        authHeader = authHeader.Replace("Bearer ", "");
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