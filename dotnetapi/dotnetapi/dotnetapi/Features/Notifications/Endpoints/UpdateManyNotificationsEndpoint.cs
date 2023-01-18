using dotnetapi.Contracts.Responses;
using dotnetapi.Features.Notifications.Contracts.Requests;
using dotnetapi.Features.Notifications.Services;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Notifications.Endpoints;

[Authorize]
public class UpdateManyNotificationsEndpoint : Endpoint<UpdateManyNotificationsRequest, ManyUpdatesResponse>
{
    private readonly ILogger<UpdateManyNotificationsEndpoint> _logger;
    private readonly INotificationsService _notificationsService;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public UpdateManyNotificationsEndpoint(
        ILogger<UpdateManyNotificationsEndpoint> logger,
        INotificationsService notificationsService,
        UserManager<AppUser> userManager,
        IProjectsService projectsService)
    {
        _logger = logger;
        _notificationsService = notificationsService;
        _userManager = userManager;
        _projectsService = projectsService;
    }

    public override void Configure()
    {
        Put("notifications");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdateManyNotificationsRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var updates = await _notificationsService.MarkManyNotificationsAsReadAsync(request);

        var successfulUpdates = 0;
        var errors = 0;
        foreach (var update in updates)
            if (!update)
                errors++;
            else
                successfulUpdates++;


        var response = new ManyUpdatesResponse
        {
            Updates = successfulUpdates,
            Errors = errors
        };

        await SendOkAsync(response, ct);
    }
}