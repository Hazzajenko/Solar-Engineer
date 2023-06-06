using Projects.Contracts.Data;

namespace Projects.Contracts.Responses;

public class GetUserProjectsResponse
{
    public IEnumerable<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
}