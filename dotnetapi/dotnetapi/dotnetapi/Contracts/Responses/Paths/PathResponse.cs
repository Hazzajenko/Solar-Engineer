using dotnetapi.Models.Dtos.Projects;

namespace dotnetapi.Contracts.Responses.Paths;

public class PathResponse
{
    public PathDto Path { get; set; } = default!;
}