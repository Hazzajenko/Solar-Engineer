using Projects.Domain.Contracts.Data;

namespace Projects.Domain.Contracts.Responses;

public class GetUserProjectsResponse
{
    public IEnumerable<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
}