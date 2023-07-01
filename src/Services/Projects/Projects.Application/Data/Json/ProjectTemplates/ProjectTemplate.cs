using System.Collections;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Json.ProjectTemplates;

public class ProjectTemplate
{
    public IEnumerable<Panel> Panels { get; set; } = default!;
    public IEnumerable<String> Strings { get; set; } = default!;
    public IEnumerable<PanelLink> PanelLinks { get; set; } = default!;
    public IEnumerable<PanelConfig> PanelConfigs { get; set; } = default!;
}
