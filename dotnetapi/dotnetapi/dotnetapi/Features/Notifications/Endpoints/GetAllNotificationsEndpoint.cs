using dotnetapi.Contracts.Responses.Users;
using dotnetapi.Features.Notifications.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Notifications.Endpoints;

[Authorize]
public class GetAllNotificationsEndpoint : EndpointWithoutRequest<AllNotificationsResponse>
{
    private readonly ILogger<GetAllNotificationsEndpoint> _logger;
    private readonly INotificationsService _notificationsService;
    private readonly UserManager<AppUser> _userManager;

    public GetAllNotificationsEndpoint(
        ILogger<GetAllNotificationsEndpoint> logger,
        INotificationsService notificationsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _notificationsService = notificationsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/notifications");
        // Roles("Admin");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var notifications = await _notificationsService.GetAllUserNotifications(user);

        /*
        if (notifications is null)
        {
            _logger.LogError("Notifications is null");
            ThrowError("Notifications is null");
        }
        */


        var response = new AllNotificationsResponse
        {
            Notifications = notifications
        };

        await SendOkAsync(response, cancellationToken);
    }
}