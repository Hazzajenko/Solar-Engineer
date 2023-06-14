using Identity.Application.Data.UnitOfWork;
using Identity.Contracts.Data;
using Identity.Domain;
using Identity.SignalR.Commands.Notifications;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mapster;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Notifications;

public record DispatchNotificationCommand(
    AppUser AppUser,
    AppUser RecipientUser,
    NotificationType NotificationType,
    ProjectInvite? ProjectInvite = null
) : ICommand<Notification>;

public class DispatchNotificationHandler : ICommandHandler<DispatchNotificationCommand, Notification>
{
    private readonly ILogger<DispatchNotificationHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;

    public DispatchNotificationHandler(
        ILogger<DispatchNotificationHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<Notification> Handle(DispatchNotificationCommand command, CancellationToken cT)
    {
        var recipientUser = command.RecipientUser;
        var appUser = command.AppUser;
        var notificationType = command.NotificationType;
        var projectData = command.ProjectInvite;

        var notification = new Notification(recipientUser, appUser, notificationType, projectData);

        await _unitOfWork.NotificationsRepository.AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();
        
        notification = await _unitOfWork.NotificationsRepository.GetByIdAsync(
            notification.Id
        );
        notification.ThrowHubExceptionIfNull();

        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveNotification(notification.Adapt<NotificationDto>());

        return notification;
    }
}
