using Identity.Application.Data.UnitOfWork;
using Identity.Application.Extensions;
using Identity.Contracts.Responses.Notifications;
using Identity.SignalR.Commands.Notifications;
using Identity.SignalR.Hubs;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Notifications;

public class GetUserNotificationsHandler : ICommandHandler<GetUserNotificationsCommand, bool>
{
    private readonly ILogger<GetUserNotificationsHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;

    public GetUserNotificationsHandler(
        ILogger<GetUserNotificationsHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(GetUserNotificationsCommand command, CancellationToken cT)
    {
        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(command.AuthUser.Id);
        appUser.ThrowHubExceptionIfNull();

        var notifications = await _unitOfWork.NotificationsRepository.GetAppUsersNotificationsAsync(
            appUser
        );

        var response = new ReceiveAppUserNotificationsResponse { Notifications = notifications };

        _logger.LogInformation(
            "User {UserName}: Received {NotificationCount} notifications",
            appUser.UserName,
            notifications.Count()
        );

        await _hubContext.Clients.User(appUser.Id.ToString()).ReceiveAppUserNotifications(response);

        return true;
    }
}
