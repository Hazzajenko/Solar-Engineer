namespace Infrastructure.Common;

public interface IEntity : IEntityBase
{
    public Guid Id { get; set; }
    // public DateTime CreatedTime { get; set; }
    // public DateTime LastModifiedTime { get; set; }
}

public interface IEntityV2<TGuid> : IEntityBase
{
    public TGuid Id2 { get; set; }
    // public DateTime CreatedTime { get; set; }
    // public DateTime LastModifiedTime { get; set; }
}

public abstract class Entity : IEntity
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; }
}

public abstract class CopyEntity : IEntity
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; } = Guid.NewGuid();
}