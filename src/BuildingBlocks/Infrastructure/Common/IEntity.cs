namespace Infrastructure.Common;

public abstract class IEntity<T>
{
    public T Id { get; protected init; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}