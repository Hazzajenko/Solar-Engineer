using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Projects;

public class ProjectCreatedResponse
{
    public ProjectDto Project { get; set; } = default!;
}