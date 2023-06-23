namespace Projects.Contracts.Responses.Projects;

public class ProjectMemberKickedResponse
{
    public string ProjectId { get; set; } = default!;
    public string MemberId { get; set; } = default!;
}
