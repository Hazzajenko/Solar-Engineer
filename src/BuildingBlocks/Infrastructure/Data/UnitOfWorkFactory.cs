using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Data;

public abstract class UnitOfWorkFactory<TContext> : IUnitOfWorkFactory
    where TContext : DbContext
{
    protected readonly TContext Context;

    protected UnitOfWorkFactory(TContext context)
    {
        Context = context;
    }

    // public 

    public EntityEntry<TEntity> Attach<TEntity>(TEntity entity) where TEntity : class
    {
        return Context.Attach(entity);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await Context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        Context.ChangeTracker.DetectChanges();
        var changes = Context.ChangeTracker.HasChanges();

        return changes;
    }
}