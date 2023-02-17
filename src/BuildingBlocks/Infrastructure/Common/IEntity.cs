namespace Infrastructure.Common;

public interface IEntity
{
    public Guid Id { get; set; }
}

public abstract class Entity : IEntity
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; } = Guid.NewGuid();
}

public abstract class CopyEntity : IEntity
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; } = Guid.NewGuid();
}