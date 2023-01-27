using dotnetapi.Contracts.Responses;
using dotnetapi.Features.Notifications.Contracts.Requests;
using dotnetapi.Features.Notifications.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

// using dotnetapi.Services.Notifications;

namespace dotnetapi.Features.Notifications.Endpoints;

[Authorize]
public class UpdateNotificationEndpoint : Endpoint<UpdateNotificationRequest, OneUpdateResponse>
{
    private readonly ILogger<UpdateNotificationEndpoint> _logger;
    private readonly INotificationsService _notificationsService;
    private readonly UserManager<AppUser> _userManager;

    public UpdateNotificationEndpoint(
        ILogger<UpdateNotificationEndpoint> logger,
        INotificationsService notificationsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _notificationsService = notificationsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Put("/notification/{notificationId:int}");
        Policies("BeAuthenticated");
        // Roles("Admin");
    }

    public override async Task HandleAsync(UpdateNotificationRequest request, CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var notificationId = Route<int>("notificationId");
        if (notificationId < 0) ThrowError("Invalid notificationId");

        var update = await _notificationsService.UpdateNotificationAsync(request);

        if (!update)
        {
            _logger.LogError("Notification Update Error");
            ThrowError("Notification Update Error");
        }

        var response = new OneUpdateResponse
        {
            Update = true
        };

        await SendOkAsync(response, cT);
    }
}