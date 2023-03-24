namespace Infrastructure.Common;

public interface IEntityBase
{
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}