namespace dotnetapi.Models.Dtos;

public class StringDto : EntityDto
{
    public AppUserDto CreatedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool Parallel { get; set; }
    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
}