namespace Projects.Contracts.Data;

public class ProjectDto : IProjectItemDto
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

    /*
    public void ThrowIfNull()
    {
        throw new NotImplementedException();
    }*/
}

public class ProjectUserDto
{
    public string Id { get; set; } = default!;
    public string Role { get; set; } = "Member";
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }

    public bool CanKick { get; set; }
    public DateTime JoinedAtTime { get; set; }
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
