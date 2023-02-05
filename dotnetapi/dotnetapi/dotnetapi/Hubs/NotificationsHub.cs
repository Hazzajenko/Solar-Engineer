using dotnetapi.Extensions;
using dotnetapi.Features.Notifications.Data;
using dotnetapi.Features.Notifications.Handlers;
using dotnetapi.Features.Users.Handlers;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Hubs;

public interface INotificationsHub
{
    Task GetNotifications(IEnumerable<NotificationDto> notifications);
}

public class NotificationsHub : Hub<INotificationsHub>
{
    private readonly ILogger<NotificationsHub> _logger;
    private readonly IMediator _mediator;

    public NotificationsHub(ILogger<NotificationsHub> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    public async Task GetNotifications(string connectionId)
    {
        var appUser = await _mediator.Send(new GetUserByUserNameQuery(Context.User!.GetUsername()));
        if (appUser is null)
            throw new HubException("appUser is null");

        var notifications = await _mediator.Send(new GetNotificationsQuery(appUser));
        await Clients.Caller.GetNotifications(notifications);
    }
}