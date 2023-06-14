namespace Projects.Contracts.Responses.Projects;

public class RejectInviteToProjectResponse
{
    public string ProjectId { get; set; } = default!;
    public string UserId { get; set; } = default!;
}
