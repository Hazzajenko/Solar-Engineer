using dotnetapi.Data;
using dotnetapi.Features.Notifications.Data;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Notifications.Handlers;

public record CreateNotificationCommand(Notification Notification) : IRequest<bool>;

public class CreateNotificationHandler : IRequestHandler<CreateNotificationCommand, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<NotificationsHub, INotificationsHub> _hubContext;

    public CreateNotificationHandler(
        IDataContext context,
        IHubContext<NotificationsHub, INotificationsHub> hubContext
    )
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreateNotificationCommand request, CancellationToken cT)
    {
        await _context.Notifications.AddAsync(request.Notification, cT);
        var save = await _context.SaveChangesAsync(cT);
        var notifications = new List<NotificationDto> { request.Notification.ToDto() };
        await _hubContext.Clients
            .User(request.Notification.AppUserUserName)
            .GetNotifications(notifications);
        return save > 0;
    }
}