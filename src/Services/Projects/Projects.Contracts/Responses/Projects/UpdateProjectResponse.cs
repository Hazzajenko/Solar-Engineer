using Projects.Contracts.Requests.Projects;

namespace Projects.Contracts.Responses.Projects;

public class UpdateProjectResponse
{
    public required string ProjectId { get; set; }
    public required ProjectChanges Changes { get; set; }
}