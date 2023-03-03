﻿using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Contracts.Data;

public class ProjectDto : IEntityDto, IUserObjectDto, IProject
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