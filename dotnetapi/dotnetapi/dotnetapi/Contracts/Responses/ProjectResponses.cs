using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses;

public class OneProjectResponse
{
    public ProjectDto Project { get; set; } = default!;
}

public class ManyProjectsResponse
{
    public IEnumerable<ProjectDto> Projects { get; init; } = Enumerable.Empty<ProjectDto>();
}