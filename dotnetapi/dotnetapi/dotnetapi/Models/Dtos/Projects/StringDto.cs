namespace dotnetapi.Models.Dtos.Projects;

public class StringDto : EntityDto
{
    public new EntityTypeDto Type { get; set; } = EntityTypeDto.String;
    public AppUserDto CreatedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public bool Parallel { get; set; }
    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
}