namespace Projects.Contracts.Data;

public class ProjectDataDto : IProjectItemDto
{
    public string Name { get; set; } = default!;
    public string Colour { get; set; } = default!;

    public IEnumerable<string> MemberIds { get; set; } = default!;

    public IEnumerable<ProjectUserDto> Members { get; set; } = new List<ProjectUserDto>();
    public string Id { get; set; } = default!;

    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
    public string UndefinedStringId { get; set; } = default!;

    public IEnumerable<StringDto> Strings { get; set; } = default!;
    public IEnumerable<PanelDto> Panels { get; set; } = default!;
    public IEnumerable<PanelLinkDto> PanelLinks { get; set; } = default!;
    public IEnumerable<PanelConfigDto> PanelConfigs { get; set; } = default!;
}
