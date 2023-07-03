using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Handlers.Notifications;
using Identity.Application.Repositories.AppUsers;
using Identity.Domain;
using Identity.SignalR.Commands.Notifications;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Microsoft.Extensions.Logging;
using Projects.Contracts.Events;

namespace Identity.Application.Consumers;

public class UserRejectedInviteToProjectConsumer : IConsumer<UserRejectedInviteToProject>
{
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly ILogger<UserRejectedInviteToProjectConsumer> _logger;
    private readonly IMediator _mediator;

    public UserRejectedInviteToProjectConsumer(
        ILogger<UserRejectedInviteToProjectConsumer> logger,
        IIdentityUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public async Task Consume(ConsumeContext<UserRejectedInviteToProject> context)
    {
        _logger.LogInformation("UserRejectedInviteToProjectConsumer");


        var appUserId = context.Message.AppUserId;
        var projectId = context.Message.ProjectId;
        var notificationId = context.Message.NotificationId;

        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(appUserId);
        if (appUser is null)
        {
            var reason = $"User with id {context.Message.AppUserId} not found";
            await context.RespondAsync(
                new UserRejectedInviteToProjectFailed(context.Message.Id, reason)
            );
            return;
        }

        var notification = await _unitOfWork.NotificationsRepository.GetByIdAsync(notificationId);

        if (notification is null)
        {
            var reason = $"Notification with id {context.Message.NotificationId} not found";
            await context.RespondAsync(
                new UserRejectedInviteToProjectFailed(context.Message.Id, reason)
            );
            return;
        }

        if (notification.AppUserId != appUserId)
        {
            var reason =
                $"Notification with id {context.Message.NotificationId} does not belong to user with id {context.Message.AppUserId}";
            await context.RespondAsync(
                new UserRejectedInviteToProjectFailed(context.Message.Id, reason)
            );
            return;
        }

        if (notification.ProjectId != projectId)
        {
            var reason =
                $"Notification with id {context.Message.NotificationId} does not belong to project with id {context.Message.ProjectId}";
            await context.RespondAsync(
                new UserRejectedInviteToProjectFailed(context.Message.Id, reason)
            );
            return;
        }

        if (notification.NotificationType != NotificationType.ProjectInviteReceived)
        {
            var reason =
                $"Notification with id {context.Message.NotificationId} is not of type {NotificationType.ProjectInviteReceived}";
            await context.RespondAsync(
                new UserRejectedInviteToProjectFailed(context.Message.Id, reason)
            );
            return;
        }

        if (notification.Completed)
        {
            var reason =
                $"Notification with id {context.Message.NotificationId} is already completed";
            await context.RespondAsync(
                new UserRejectedInviteToProjectFailed(context.Message.Id, reason)
            );
            return;
        }

        notification.SetNotificationCompleted();

        await _unitOfWork.NotificationsRepository.UpdateAsync(notification);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation(
            "User {UserId} - {UserUserName} rejected invite to project {Project}",
            appUser.Id,
            appUser.UserName,
            projectId
        );

        await context.RespondAsync(new InvitedUsersToProjectSuccess(context.Message.Id));
    }
}
