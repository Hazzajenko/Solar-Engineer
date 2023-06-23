using Projects.Contracts.Requests.Projects;

namespace Projects.Contracts.Responses.Projects;

public class ProjectMemberUpdatedResponse
{
    public string ProjectId { get; set; } = default!;
    public string MemberId { get; set; } = default!;
    public Dictionary<string, object> Changes { get; set; } = default!;
    // public ProjectMemberUpdate Update { get; set; } = default!;
}

/*public class ProjectMemberUpdate
{

    // public ProjectMemberChanges Changes { get; set; } = default!;
}*/

/*
public class ProjectMemberChanges
{
    public string? Role { get; set; }
    public bool? CanCreate { get; set; }
    public bool? CanDelete { get; set; }
    public bool? CanInvite { get; set; }
    public bool? CanKick { get; set; }
}
*/
