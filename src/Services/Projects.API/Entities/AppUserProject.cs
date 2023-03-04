﻿using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class AppUserProject : IEntity, IProject
{
    public Guid AppUserId { get; set; }
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}