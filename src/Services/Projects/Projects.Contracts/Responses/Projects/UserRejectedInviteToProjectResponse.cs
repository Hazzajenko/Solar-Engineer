namespace Projects.Contracts.Responses.Projects;

public class UserRejectedInviteToProjectResponse
{
    public string ProjectId { get; set; } = default!;
    public string UserId { get; set; } = default!;
}
