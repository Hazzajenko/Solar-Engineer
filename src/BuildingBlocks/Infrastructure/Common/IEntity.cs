namespace Infrastructure.Common;

public interface IEntity
{
    public Guid Id { get; protected init; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}