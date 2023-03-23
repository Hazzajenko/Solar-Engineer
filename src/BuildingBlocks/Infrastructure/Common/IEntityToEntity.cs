namespace Infrastructure.Common;

public interface IEntityToEntity
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}