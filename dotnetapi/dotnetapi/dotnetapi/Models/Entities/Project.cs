namespace dotnetapi.Models.Entities;

public class Project : BaseEntity {
    public string Name { get; set; } = default!;
    public AppUser CreatedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = default!;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public ICollection<String> Strings { get; set; } = default!;
}