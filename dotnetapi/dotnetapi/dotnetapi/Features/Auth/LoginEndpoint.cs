using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Auth;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Auth;

public class LoginEndpoint : Endpoint<AuthRequest, LoginResponse>
{
    private readonly IAuthService _authService;
    private readonly ILogger<LoginEndpoint> _logger;
    private readonly SignInManager<AppUser> _signInManager;

    private readonly UserManager<AppUser> _userManager;

    public LoginEndpoint(
        ILogger<LoginEndpoint> logger,
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        IAuthService authService
    )
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _authService = authService;
    }

    public override void Configure()
    {
        Post("/auth/login");
        Description(b => b
            .Accepts<AuthRequest>("application/json"));
        AllowAnonymous();
    }

    public override async Task HandleAsync(AuthRequest request, CancellationToken cT)
    {
        var user = await _userManager.Users
            .SingleOrDefaultAsync(x => x.UserName == request.UserName.ToLower(), cT);

        if (user == null)
        {
            _logger.LogError("Unauthorized, {UserName} is invalid", request.UserName);
            await SendNotFoundAsync(cT);
            return;
        }

        var result = await _signInManager
            .CheckPasswordSignInAsync(user, request.Password, false);

        if (!result.Succeeded)
        {
            _logger.LogError("Unauthorized, Password is invalid");
            await SendUnauthorizedAsync(cT);
            return;
        }

        var signInResult = await _authService.HandleSignIn(user);
        if (string.IsNullOrEmpty(signInResult.Token))
        {
            _logger.LogError("Token Error");
            await SendUnauthorizedAsync(cT);
            return;
        }

        _logger.LogInformation("{UserName} has logged in", user.UserName);
        // return Ok(signInResult);
        await SendOkAsync(signInResult, cT);
    }
}