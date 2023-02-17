using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Data;

public interface IUnitOfWorkFactory
{
    EntityEntry<TEntity> Attach<TEntity>(TEntity entity) where TEntity : class;
    Task<bool> SaveChangesAsync();
    bool HasChanges();
}