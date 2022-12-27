﻿namespace dotnetapi.Models.Entities;

public class AppUserProject : BaseEntity {
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public int ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public DateTime JoinedAt { get; set; }
    public string Role { get; set; } = default!;
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}