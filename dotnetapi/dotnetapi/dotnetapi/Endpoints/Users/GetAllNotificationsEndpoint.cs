﻿using dotnetapi.Contracts.Responses.Users;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Notifications;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Users;

[Authorize]
public class GetAllNotificationsEndpoint : EndpointWithoutRequest<AllNotificationsResponse>
{
    private readonly ILogger<GetAllNotificationsEndpoint> _logger;
    private readonly INotificationsService _notificationsService;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public GetAllNotificationsEndpoint(
        ILogger<GetAllNotificationsEndpoint> logger,
        IUsersService usersService,
        INotificationsService notificationsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _usersService = usersService;
        _notificationsService = notificationsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/user/notifications");
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

        var notifications = await _notificationsService.GetAllUserNotifications(user.UserName!);

        if (notifications is null)
        {
            _logger.LogError("Notifications is null");
            ThrowError("Notifications is null");
        }


        var response = new AllNotificationsResponse
        {
            Notifications = notifications
        };

        await SendOkAsync(response, cancellationToken);
    }
}