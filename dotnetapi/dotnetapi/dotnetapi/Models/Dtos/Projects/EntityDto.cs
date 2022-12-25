namespace dotnetapi.Models.Dtos;

public class EntityDto
{
    public string Id { get; set; } = default!;
    public int ProjectId { get; set; } = default!;
    public EntityTypeDto Type { get; set; } = default!;
}

public enum EntityTypeDto
{
    Undefined,
    Tracker,
    String,
    Link
}