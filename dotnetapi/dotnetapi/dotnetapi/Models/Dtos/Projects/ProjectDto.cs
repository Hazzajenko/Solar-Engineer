namespace dotnetapi.Models.Dtos;

public class ProjectDto {
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public AppUserDto CreatedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}