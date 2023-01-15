using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Auth;
using dotnetapi.Validation;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Endpoints.Auth;

public class RegisterEndpoint : Endpoint<AuthRequest, LoginResponse>
{
    private readonly IAuthService _authService;
    private readonly ILogger<RegisterEndpoint> _logger;
    private readonly SignInManager<AppUser> _signInManager;

    private readonly UserManager<AppUser> _userManager;

    public RegisterEndpoint(
        ILogger<RegisterEndpoint> logger,
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
        Post("/auth/register");
        Description(b => b
            .Accepts<AuthRequest>("application/json"));
        AllowAnonymous();
    }

    public override async Task HandleAsync(AuthRequest request, CancellationToken cT)
    {
        var validator = new UserRequestValidator();
        var validResult = await validator.ValidateAsync(request, cT);
        if (!validResult.IsValid)
            foreach (var error in validResult.Errors)
                AddError(error.ErrorMessage);
        ThrowIfAnyErrors();

        var userExists = await _userManager.FindByNameAsync(request.Username);
        if (userExists is not null)
        {
            _logger.LogError("Bad request, {Username} is taken", request.Username);
            ThrowError("Username is taken");
        }

        var appUser = request.ToEntityV3();
        appUser.UserName = request.Username.ToLower();

        var result = await _userManager.CreateAsync(appUser, request.Password);

        if (!result.Succeeded)
        {
            _logger.LogError("Bad request, {@Errors}", result.Errors);
            await SendUnauthorizedAsync(cT);
            return;
            // return BadRequest(result.Errors);
        }

        // ThrowIfAnyErrors();

        var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

        if (!roleResult.Succeeded)
        {
            _logger.LogError("Bad request, {@Errors}", roleResult.Errors);
            await SendUnauthorizedAsync(cT);
            return;
            /*foreach (var error in roleResult.Errors)
                AddError(error.Description);*/
            // return BadRequest(result.Errors);
        }

        // ThrowIfAnyErrors();

        _logger.LogInformation("{Username} has signed up", appUser.UserName);
        var signUpResult = await _authService.HandleSignIn(appUser);
        if (signUpResult.Token.IsNullOrEmpty())
        {
            _logger.LogError("Token Error");
            await SendUnauthorizedAsync(cT);
            return;
        }

        _logger.LogInformation("{Username} has logged in", appUser.UserName);
        await SendOkAsync(signUpResult, cT);
    }
}