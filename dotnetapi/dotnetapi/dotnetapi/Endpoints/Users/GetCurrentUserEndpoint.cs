using dotnetapi.Models.Entities;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Users;

[Authorize]
public class GetCurrentUserEndpoint : EndpointWithoutRequest
{
    private readonly ILogger<GetCurrentUserEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public GetCurrentUserEndpoint(
        ILogger<GetCurrentUserEndpoint> logger,
        IUsersService usersService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _usersService = usersService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/users/current");
        Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        await SendOkAsync(user, cancellationToken);
    }
}