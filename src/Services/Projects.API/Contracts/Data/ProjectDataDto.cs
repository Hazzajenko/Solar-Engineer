﻿using Projects.API.Common;

namespace Projects.API.Contracts.Data;

public class ProjectDataDto : IProjectItemDto
{
    public string Name { get; set; } = default!;
    public IEnumerable<StringDto> Strings { get; set; } = default!;
    public IEnumerable<PanelDto> Panels { get; set; } = default!;
    public IEnumerable<PanelLinkDto> PanelLinks { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }

    public string CreatedById { get; set; } = default!;
    // public IEnumerable<AppUserProject> AppUserProjects { get; set; } = default!;
}