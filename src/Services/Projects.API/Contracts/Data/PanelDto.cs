using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Contracts.Data;

public class PanelDto : IEntityDto, IUserObjectDto, IProject
{
    public string StringId { get; set; } = default!;
    public string PanelConfigId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}