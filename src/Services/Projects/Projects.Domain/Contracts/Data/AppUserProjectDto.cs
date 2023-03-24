namespace Projects.Domain.Contracts.Data;

public class AppUserProjectDto
{
    public string AppUserId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
}