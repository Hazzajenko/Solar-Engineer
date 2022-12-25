using dotnetapi.Models.Dtos.Projects;

namespace dotnetapi.Contracts.Responses;

public class OneProjectResponse
{
    public ProjectDto Project { get; set; } = default!;
}

public class ManyProjectsResponse
{
    public IEnumerable<ProjectDto> Projects { get; init; } = Enumerable.Empty<ProjectDto>();
}

public class ProjectDataResponse
{
    public ProjectDto Project { get; set; } = default!;
    public IEnumerable<StringDto> Strings { get; init; } = Enumerable.Empty<StringDto>();
    public IEnumerable<PanelDto> Panels { get; init; } = Enumerable.Empty<PanelDto>();
    public IEnumerable<PanelLinkDto> Links { get; init; } = Enumerable.Empty<PanelLinkDto>();
}