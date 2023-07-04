using Identity.Application.Data.UnitOfWork;
using Identity.Application.Extensions;
using Identity.Contracts.Responses.Notifications;
using Identity.SignalR.Commands.Notifications;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Notifications;

public class ReadManyNotificationsHandler : ICommandHandler<ReadManyNotificationsCommand, bool>
{
    private readonly ILogger<ReadManyNotificationsHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public ReadManyNotificationsHandler(
        ILogger<ReadManyNotificationsHandler> logger,
        IIdentityUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(ReadManyNotificationsCommand command, CancellationToken cT)
    {
        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(command.AuthUser.Id);
        appUser.ThrowHubExceptionIfNull();

        var notificationIds = command.NotificationIds.Select(Guid.Parse);

        await _unitOfWork.NotificationsRepository.ExecuteUpdateAsync(
            notification => notificationIds.Contains(notification.Id),
            notification =>
                notification
                    .SetProperty(x => x.SeenByAppUser, x => true)
                    .SetProperty(x => x.SeenByAppUserTime, x => DateTime.UtcNow)
        );

        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "Many notifications marked read by {AppUser}",
            appUser.ToAppUserLog()
        );

        return true;
    }
}
