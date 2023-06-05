using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.Domain.Contracts.Responses.Projects;

public class UpdateProjectResponse
{
    public required string ProjectId { get; set; }
    public required ProjectChanges Changes { get; set; }
}