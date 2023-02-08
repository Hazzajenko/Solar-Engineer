using dotnetapi.Models.Entities;
using dotnetapi.Services.Http;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Auth.Endpoints;

public class Auth0RefreshToken : Endpoint<RefreshTokenRequest, RefreshTokenResponse>
{
    private readonly IHttpClientFactoryService _httpClientFactoryService;
    private readonly UserManager<AppUser> _userManager;

    public Auth0RefreshToken(
        UserManager<AppUser> userManager,
        IHttpClientFactoryService httpClientFactoryService
    )
    {
        _userManager = userManager;
        _httpClientFactoryService = httpClientFactoryService;
    }

    public override void Configure()
    {
        Post("/auth0/refresh");
    }

    public override async Task HandleAsync(RefreshTokenRequest request, CancellationToken cT)
    {
        var refreshToken = await _httpClientFactoryService.RefreshToken(request.RefreshToken);
        if (refreshToken is null)
        {
            Logger.LogError("refreshToken is null");
            ThrowError("refreshToken is null");
        }

        Response = refreshToken;

        await SendOkAsync(Response, cT);
    }
}