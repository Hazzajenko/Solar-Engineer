using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Projects;

public class UserAcceptedInviteToProjectResponse
{
    public string ProjectId { get; set; } = default!;
    public ProjectUserDto Member { get; set; } = default!;
}
