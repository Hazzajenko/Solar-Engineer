using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Users.API.Data;

public interface ITrackContext
{
    EntityEntry<TEntity> Attach<TEntity>(TEntity entity) where TEntity : class;
}