namespace Infrastructure.Common;

public abstract class Entity<T>
{
    public T Id { get; protected init; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}

public abstract class CopyEntity<T>
{
    public T Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}