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

        await _unitOfWork.NotificationsRepository.ExecuteUpdateAsync(
            notification => notificationIds.Contains(notification.Id),
            notification =>
                notification
                    .SetProperty(x => x.Completed, x => true)
                    .SetProperty(x => x.CompletedTime, x => DateTime.UtcNow)
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
