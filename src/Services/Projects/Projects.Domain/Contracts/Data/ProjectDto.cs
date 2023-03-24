using Projects.Domain.Common;

namespace Projects.Domain.Contracts.Data;

public class ProjectDto : IProjectItemDto
{
    public string Name { get; set; } = default!;

    public IEnumerable<string> MemberIds { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;

    /*
    public void ThrowIfNull()
    {
        throw new NotImplementedException();
    }*/
}

public class ProjectV2Dto : IProjectItemDto
{
    public string Name { get; set; } = default!;
    public IEnumerable<string> MemberIds { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}