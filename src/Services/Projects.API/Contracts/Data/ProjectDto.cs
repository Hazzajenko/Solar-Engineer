﻿using Projects.API.Common;

namespace Projects.API.Contracts.Data;

public class ProjectDto : IProjectItemDto
{
    public string Name { get; set; } = default!;
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