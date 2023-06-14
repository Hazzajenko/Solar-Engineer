namespace Infrastructure.Events;

public record UserAcceptedInviteToProject(
    Guid Id,
    Guid AppUserId,
    Guid ProjectId,
    Guid NotificationId
);

public record UserAcceptedInviteToProjectSuccess(Guid Id);

public record UserAcceptedInviteToProjectFailed(Guid Id, string Reason);
