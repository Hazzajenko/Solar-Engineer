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

public class CompleteManyNotificationsHandler
    : ICommandHandler<CompleteManyNotificationsCommand, bool>
{
    private readonly ILogger<CompleteManyNotificationsHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public CompleteManyNotificationsHandler(
        ILogger<CompleteManyNotificationsHandler> logger,
        IIdentityUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        CompleteManyNotificationsCommand command,
        CancellationToken cT
    )
    {
        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(command.AuthUser.Id);
        appUser.ThrowHubExceptionIfNull();

        var notificationIds = command.NotificationIds.Select(Guid.Parse);

        var notifications =
            await _unitOfWork.NotificationsRepository.GetManyNotificationsByIdsAsync(
                notificationIds
            );
        // Parallel.ForEach(notifications, notification => notification.SetNotificationCompleted());

        // context.Employees.ExecuteUpdate(s => s.SetProperty(e => e.Salary, e => e.Salary + 1000));
        await _unitOfWork.NotificationsRepository.ExecuteUpdateAsync(
            notification => notification.SetProperty(x => x.Completed, x => true)
        );
        // await _unitOfWork.NotificationsRepository.UpdateRangeAsync(notifications);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Many notifications marked read by {AppUserId} - {AppUserUserName}",
            appUser.Id.ToString(),
            appUser.UserName
        );

        return true;
    }
}
