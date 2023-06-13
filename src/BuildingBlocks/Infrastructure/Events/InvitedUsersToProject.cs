namespace Infrastructure.Events;

public record InvitedUsersToProject(
    Guid Id,
    Guid AppUserId,
    Guid ProjectId,
    IEnumerable<string> UserIds
);

public record InvitedUsersToProjectSuccess(Guid Id);

public record InvitedUsersToProjectFailed(Guid Id, string Reason);
