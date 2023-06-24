namespace ApplicationCore.Interfaces;

public interface IEntityDto
{
    public string Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}