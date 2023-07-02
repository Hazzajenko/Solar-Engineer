using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Projects;

public class GetProjectByIdResponse
{
    public ProjectDataDto Project { get; set; } = default!;
}
