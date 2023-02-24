using Projects.API.Contracts.Data;

namespace Projects.API.Contracts.Responses;

public class GetUserProjectsResponse
{
    public IEnumerable<ProjectDto> Projects { get; set; } = new List<ProjectDto>();
}