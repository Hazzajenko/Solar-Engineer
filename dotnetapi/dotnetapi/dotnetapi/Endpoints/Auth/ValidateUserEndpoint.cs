using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Auth;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Auth;

public class ValidateUserEndpoint : Endpoint<ValidateUserRequest, LoginResponse>
{
    private readonly IAuthService _authService;
    private readonly ILogger<ValidateUserEndpoint> _logger;
    private readonly SignInManager<AppUser> _signInManager;

    private readonly UserManager<AppUser> _userManager;

    public ValidateUserEndpoint(
        ILogger<ValidateUserEndpoint> logger,
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
        Post("/auth/validate");
        Description(b => b
            .Accepts<ValidateUserRequest>("application/json"));
        AllowAnonymous();
    }

    public override async Task HandleAsync(ValidateUserRequest request, CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            _logger.LogError("Bad request, User is invalid");
            await SendUnauthorizedAsync(cT);
            ThrowError("Bad request, User is invalid");
        }

        var signInResult = await _authService.HandleSignIn(user);
        if (string.IsNullOrEmpty(signInResult.Token))
        {
            _logger.LogError("Token Error");
            await SendUnauthorizedAsync(cT);
        }

        _logger.LogInformation("{Username} has logged in", user.UserName);
        await SendOkAsync(signInResult, cT);
    }
}