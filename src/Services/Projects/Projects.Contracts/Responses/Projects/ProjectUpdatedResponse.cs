using Projects.Contracts.Requests.Projects;

namespace Projects.Contracts.Responses.Projects;

public class ProjectUpdatedResponse
{
    public required string ProjectId { get; set; }
    public required ProjectChanges Changes { get; set; }
}