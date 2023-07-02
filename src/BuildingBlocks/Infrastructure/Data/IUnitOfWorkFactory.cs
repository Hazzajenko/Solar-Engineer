using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Data;

public interface IUnitOfWorkFactory
{
    EntityEntry<TEntity> Attach<TEntity>(TEntity entity)
        where TEntity : class;
    Task<bool> SaveChangesAsync();

    void PrintTrackedEntities();
    void DetachAllEntities();
    bool HasChanges();
}
