namespace Infrastructure.Events;

public record UserRejectedInviteToProject(
    Guid Id,
    Guid AppUserId,
    Guid ProjectId,
    Guid NotificationId
);

public record UserRejectedInviteToProjectSuccess(Guid Id);

public record UserRejectedInviteToProjectFailed(Guid Id, string Reason);
