using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
public class GetCurrentUserEndpoint : EndpointWithoutRequest
{
    private readonly ILogger<GetCurrentUserEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public GetCurrentUserEndpoint(
        ILogger<GetCurrentUserEndpoint> logger,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/users/current");
        // Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        await SendOkAsync(user, cancellationToken);
    }
}