using dotnetapi.Models.Dtos;

namespace dotnetapi.Models.Dtos;

public class AppUserProjectDto {
    public int Id { get; set; }
    public int AppUserId { get; set; }
    public AppUserDto AppUser { get; set; } = default!;
    public int ProjectId { get; set; }
    public ProjectDto Project { get; set; } = default!;
    public DateTime JoinedAt { get; set; }
    public string Role { get; set; } = default!;
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}