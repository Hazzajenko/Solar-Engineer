using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Projects;

public class InvitedToProjectResponse
{
    public ProjectDto Project { get; set; } = default!;
}