using Identity.Application.Data.UnitOfWork;
using Identity.Domain;
using Identity.SignalR.Commands.Notifications;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Notifications;

public record DispatchNotificationCommand(
    AppUser AppUser,
    AppUser RecipientUser,
    NotificationType NotificationType
) : ICommand<bool>;

public class DispatchNotificationHandler : ICommandHandler<DispatchNotificationCommand, bool>
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

    public async ValueTask<bool> Handle(DispatchNotificationCommand command, CancellationToken cT)
    {
        var recipientUser = command.RecipientUser;
        var appUser = command.AppUser;
        var notificationType = command.NotificationType;
        var notification = new Notification(recipientUser, appUser, notificationType);

        await _unitOfWork.NotificationsRepository.AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        var notificationDto = await _unitOfWork.NotificationsRepository.GetNotificationDtoByIdAsync(
            notification.Id
        );
        notificationDto.ThrowHubExceptionIfNull();

        await _hubContext.Clients
            .User(recipientUser.Id.ToString())
            .ReceiveNotification(notificationDto);

        return true;
    }
}
