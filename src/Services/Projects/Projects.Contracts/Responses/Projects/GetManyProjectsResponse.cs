using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Projects;

public class GetManyProjectsResponse
{
    public IEnumerable<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
}