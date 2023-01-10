using dotnetapi.Models.Dtos.Projects;

namespace dotnetapi.Contracts.Responses.Paths;

public class ManyPathsResponse
{
    public IEnumerable<PathDto> Paths { get; init; } = Enumerable.Empty<PathDto>();
}