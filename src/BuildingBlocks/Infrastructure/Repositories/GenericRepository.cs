using System.Linq.Expressions;
using DotNetCore.EntityFrameworkCore;
using Infrastructure.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Infrastructure.Repositories;

public abstract class GenericRepository<TContext, TModel>
    : EFRepository<TModel>,
        IGenericRepository<TModel>
    where TContext : DbContext
    where TModel : class, IEntity
{
    private readonly TContext _context;

    protected GenericRepository(TContext context)
        : base(context)
    {
        _context = context;
    }

    public Task<TModel?> GetByIdAsync(Guid id)
    {
        // Queryable.Find
        // base.Find(id);
        return Queryable.SingleOrDefaultAsync(user => user.Id == id);
    }

    public async Task<TModel?> GetByIdNoTracking(Guid id)
    {
        return await Queryable.AsNoTracking().SingleOrDefaultAsync(user => user.Id == id);
    }

    public async Task<TModel> AddAndSaveChangesAsync(TModel model)
    {
        await AddAsync(model);
        await SaveChangesAsync();
        return model;
    }

    public async Task<IEnumerable<TModel>> AddManyAndSaveChangesAsync(IEnumerable<TModel> items)
    {
        await AddRangeAsync(items);
        await SaveChangesAsync();
        return items;
    }

    public async Task<TModel> UpdateAndSaveChangesAsync(TModel model)
    {
        await UpdateAsync(model);
        await SaveChangesAsync();
        return model;
    }

    public object[] GetKeys(TModel entity)
    {
        var keyNames = _context.Model
            .FindEntityType(typeof(TModel))!
            .FindPrimaryKey()!
            .Properties.Select(x => x.Name);
        return keyNames
            .Select(keyName => entity.GetType().GetProperty(keyName)!.GetValue(entity, null)!)
            .ToArray();
    }

    public async Task<bool> FindAndDeleteAsync(Expression<Func<TModel, bool>> where)
    {
        var model = await Queryable.SingleOrDefaultAsync(where);
        if (model is null)
            return false;
        await Queryable.Where(where).Take(1).ExecuteDeleteAsync();
        return await SaveChangesAsync();
    }

    public async Task<bool> FindManyAndDeleteAsync(Expression<Func<TModel, bool>> where)
    {
        var entities = await Queryable.Where(where).ToListAsync();
        if (entities.Any() is false)
            return false;
        // _context.Set<TModel>().RemoveRange(entities);
        // _context.Model
        // _context[typeof(TModel).Name].RemoveRange(entities);
        await Queryable.Where(where).ExecuteDeleteAsync();
        // await Queryable.Where(where).ExecuteDeleteAsync();
        return await SaveChangesAsync();
    }

    public async Task<int> ExecuteUpdateAsync(
        Expression<Func<TModel, bool>> predicate,
        Expression<Func<SetPropertyCalls<TModel>, SetPropertyCalls<TModel>>> updateFunc
    )
    {
        return await Queryable.Where(predicate).ExecuteUpdateAsync(updateFunc);
    }

    public async Task<IEnumerable<TModel>> UpdateManyAndSaveChangesAsync(IEnumerable<TModel> items)
    {
        _context.Set<TModel>().UpdateRange(items);
        // await UpdateRangeAsync(items);
        await SaveChangesAsync();
        return items;
    }

    public async Task<int> ExecuteDeleteAsync(Expression<Func<TModel, bool>> predicate)
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
