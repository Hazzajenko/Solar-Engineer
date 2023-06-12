using Identity.Application.Data.UnitOfWork;
using Identity.Contracts.Responses.Notifications;
using Identity.SignalR.Commands.Notifications;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Notifications;

public class ReceiveNotificationHandler : ICommandHandler<ReceiveNotificationCommand, bool>
{
    private readonly ILogger<ReceiveNotificationHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public ReceiveNotificationHandler(
        ILogger<ReceiveNotificationHandler> logger,
        IIdentityUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(ReceiveNotificationCommand command, CancellationToken cT)
    {
        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(command.AuthUser.Id);
        appUser.ThrowHubExceptionIfNull();

        var notificationId = command.NotificationId.ToGuid();

        var notification = await _unitOfWork.NotificationsRepository.GetByIdAsync(notificationId);
        notification.ThrowHubExceptionIfNull();

        notification.SetReceivedByAppUser();
        await _unitOfWork.NotificationsRepository.UpdateAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Notification received by {AppUserId} - {AppUserUserName}",
            appUser.Id.ToString(),
            appUser.UserName
        );

        return true;
    }
}
