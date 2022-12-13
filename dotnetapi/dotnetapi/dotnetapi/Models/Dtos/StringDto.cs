namespace dotnetapi.Models.Dtos;

public class StringDto
{
    public string Id { get; set; } = default!;
    public int ProjectId { get; set; }
    public AppUserDto CreatedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool IsInParallel { get; set; }
    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
}