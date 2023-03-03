using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Contracts.Data;

public class StringDto : IEntityDto, IUserObjectDto, IProject
{
    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
    public bool Parallel { get; set; }
    public string ProjectId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}