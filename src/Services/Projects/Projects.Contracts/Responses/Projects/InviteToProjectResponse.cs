namespace Projects.Contracts.Responses.Projects;

public class InviteToProjectResponse
{
    public string ProjectId { get; set; } = default!;
    public string InvitedByUserId { get; set; } = default!;
    public IEnumerable<string> InvitedUserIds { get; set; } = default!;
}