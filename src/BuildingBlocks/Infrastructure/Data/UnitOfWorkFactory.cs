using ApplicationCore.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Data;

/// <summary>
///     This class is used to initialize the DbContext.
///     It is called from the Program class.
///     It is also called from the Integration Tests.
/// </summary>
public abstract class UnitOfWorkFactory<TContext> : IUnitOfWorkFactory
    where TContext : DbContext
{
    protected readonly TContext Context;

    protected UnitOfWorkFactory(TContext context)
    {
        Context = context;
    }

    // public

    public EntityEntry<TEntity> Attach<TEntity>(TEntity entity)
        where TEntity : class
    {
        return Context.Attach(entity);
    }

    /// <summary>
    ///     This method is used to save changes to the database.
    ///     It is called from the Command Handlers.
    /// </summary>
    public async Task<bool> SaveChangesAsync()
    {
        UpdateLastModifiedTimeBeforeSave();
        return await Context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        Context.ChangeTracker.DetectChanges();
        var changes = Context.ChangeTracker.HasChanges();

        return changes;
    }

    public void PrintTrackedEntities()
    {
        var entries = Context.ChangeTracker.Entries();

        foreach (EntityEntry entry in entries)
        {
            Console.WriteLine(
                $"Entity: {entry.Entity.GetType().Name}, State: {entry.State.ToString()}"
            );
        }
    }

    public void DetachAllEntities()
    {
        var entitiesToDetach = Context.ChangeTracker
            .Entries()
            .Where(e => e.State != EntityState.Detached)
            .ToList();

        foreach (EntityEntry entry in entitiesToDetach)
            entry.State = EntityState.Detached;
    }

    public void PrintTrackedEntitiesOfType<T>()
        where T : class
    {
        var entries = Context.ChangeTracker.Entries<T>();

        foreach (var entry in entries)
        {
            Console.WriteLine(
                $"Entity: {entry.Entity.GetType().Name}, State: {entry.State.ToString()}"
            );
        }
    }

    private void UpdateLastModifiedTimeBeforeSave()
    {
        foreach (var entry in Context.ChangeTracker.Entries<IEntityBase>().ToList())
            entry.Entity.LastModifiedTime = entry.State switch
            {
                EntityState.Modified => DateTime.UtcNow,
                _ => entry.Entity.LastModifiedTime
            };
    }
}
