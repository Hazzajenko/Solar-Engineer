using Infrastructure.Common;
using Projects.API.Common;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Contracts.Data;

public interface IPanelDto : IProjectItemDtoOf<Panel>, IEntityDto, IUserObjectDto, IProject
{
    string Type { get; set; }
    string StringId { get; set; }
    string PanelConfigId { get; set; }
    string Location { get; set; }
    int Rotation { get; set; }
    string ProjectId { get; set; }
}

public class PanelDto : IPanelDto
{
    public string Type { get; set; } = BlockType.Panel;
    public string StringId { get; set; } = default!;
    public string PanelConfigId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public string Location { get; set; } = default!;
    public int Rotation { get; set; }
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}