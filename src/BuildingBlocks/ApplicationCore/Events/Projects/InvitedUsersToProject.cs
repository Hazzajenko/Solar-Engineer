namespace ApplicationCore.Events.Projects;

public record InvitedUsersToProject(
    Guid Id,
    Guid AppUserId,
    Guid ProjectId,
    string ProjectName,
    string ProjectPhotoUrl,
    IEnumerable<string> UserIds
);

public record InvitedUsersToProjectSuccess(Guid Id);

public record InvitedUsersToProjectFailed(Guid Id, string Reason);
