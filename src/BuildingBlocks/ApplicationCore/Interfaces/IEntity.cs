namespace ApplicationCore.Interfaces;

public interface IEntity : IEntityBase, IAggregateRoot
{
    public Guid Id { get; set; }
}

public interface IEntityBase
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}

public abstract class Entity : IEntity
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; }
}
