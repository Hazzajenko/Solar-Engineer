using System.Linq.Expressions;
using DotNetCore.EntityFrameworkCore;
using Infrastructure.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public abstract class EntityToEntityRepository<TContext, TEntityToEntity>
    : EFRepository<TEntityToEntity>,
        IEntityToEntityRepository<TEntityToEntity>
    where TContext : DbContext
    where TEntityToEntity : class, IEntityToEntity
{
    private readonly TContext _context;

    protected EntityToEntityRepository(TContext context)
        : base(context)
    {
        _context = context;
    }

    /*public Task<TEntityToEntity?> GetByIdAsync(Guid id)
    {
        // Get()
        return Queryable.SingleOrDefaultAsync(user => user.Id == id);
    }*/

    public async Task<TEntityToEntity> AddAndSaveChangesAsync(TEntityToEntity model)
    {
        await AddAsync(model);
        await SaveChangesAsync();
        return model;
    }

    public async Task<IEnumerable<TEntityToEntity>> AddManyAndSaveChangesAsync(
        IEnumerable<TEntityToEntity> items
    )
    {
        await AddRangeAsync(items);
        await SaveChangesAsync();
        return items;
    }

    public async Task<TEntityToEntity> UpdateAndSaveChangesAsync(TEntityToEntity model)
    {
        await UpdateAsync(model);
        await SaveChangesAsync();
        return model;
    }

    public object[] GetKeys(TEntityToEntity entity)
    {
        var keyNames = _context.Model
            .FindEntityType(typeof(TEntityToEntity))!
            .FindPrimaryKey()!
            .Properties.Select(x => x.Name);
        return keyNames
            .Select(keyName => entity.GetType().GetProperty(keyName)!.GetValue(entity, null)!)
            .ToArray();
    }

    public async Task<bool> FindAndDeleteAsync(Expression<Func<TEntityToEntity, bool>> where)
    {
        var model = await Queryable.SingleOrDefaultAsync(where);
        if (model is null)
            return false;
        await Queryable.Where(where).Take(1).ExecuteDeleteAsync();
        return await SaveChangesAsync();
    }

    public async Task<IEnumerable<TEntityToEntity>> UpdateManyAndSaveChangesAsync(
        IEnumerable<TEntityToEntity> items
    )
    {
        _context.Set<TEntityToEntity>().UpdateRange(items);
        // await UpdateRangeAsync(items);
        await SaveChangesAsync();
        return items;
    }

    public async Task<int> ExecuteDeleteAsync(Expression<Func<TEntityToEntity, bool>> predicate)
    {
        return await Queryable.Where(predicate).ExecuteDeleteAsync();
    }

    protected async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    /*
    public async Task<bool> DeleteAsync(Guid id)
    {
        return Queryable.ExecuteDelete(user => user.Id == id);
    }*/
}
