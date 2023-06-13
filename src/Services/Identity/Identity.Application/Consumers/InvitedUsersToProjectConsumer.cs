using Identity.Application.Data.UnitOfWork;
using Identity.Application.Handlers.Notifications;
using Identity.Application.Repositories.AppUsers;
using Identity.Domain;
using Infrastructure.Contracts.Events;
using Infrastructure.Events;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Microsoft.Extensions.Logging;
using Projects.Contracts.Events;

namespace Identity.Application.Consumers;

public class InvitedUsersToProjectConsumer : IConsumer<InvitedUsersToProject>
{
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly ILogger<InvitedUsersToProjectConsumer> _logger;
    private readonly IMediator _mediator;

    public InvitedUsersToProjectConsumer(
        ILogger<InvitedUsersToProjectConsumer> logger,
        IIdentityUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public async Task Consume(ConsumeContext<InvitedUsersToProject> context)
    {
        _logger.LogInformation("InvitedUsersToProjectConsumer");
        context.Message.DumpObjectJson();

        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(context.Message.AppUserId);
        if (appUser is null)
        {
            var reason = $"User with id {context.Message.AppUserId} not found";
            await context.RespondAsync(new InvitedUsersToProjectFailed(context.Message.Id, reason));
            return;
        }

        var userIds = context.Message.UserIds.Select(Guid.Parse);

        var recipientUsers = await _unitOfWork.AppUsersRepository.GetAppUsersByIdsAsync(userIds);

        if (recipientUsers.Count() != context.Message.UserIds.Count())
        {
            var usersThatWereNotFound = context.Message.UserIds
                .Where(id => recipientUsers.All(u => u.Id.ToString() != id))
                .Select(id => id.ToString())
                .ToList();
            var reason = $"Users with ids {string.Join(", ", usersThatWereNotFound)} not found";
            await context.RespondAsync(new InvitedUsersToProjectFailed(context.Message.Id, reason));
            return;
        }

        foreach (var recipientUser in recipientUsers)
        {
            var notificationCommand = new DispatchNotificationCommand(
                appUser,
                recipientUser,
                NotificationType.ProjectInviteReceived
/*new Dictionary<string, string>
                {
                    {"ProjectId", context.Message.ProjectId.ToString()},
                    {"ProjectName", context.Message.ProjectName}
                }*/
                
            );
            await _mediator.Send(notificationCommand);
        }

        await context.RespondAsync(new InvitedUsersToProjectSuccess(context.Message.Id));
    }
}
