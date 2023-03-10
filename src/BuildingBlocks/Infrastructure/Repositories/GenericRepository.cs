using DotNetCore.EntityFrameworkCore;
using Infrastructure.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public abstract class GenericRepository<TContext, TModel> : EFRepository<TModel>, IGenericRepository<TModel>
    where TContext : DbContext
    where TModel : class, IEntity
{
    private readonly TContext _context;

    protected GenericRepository(TContext context) : base(context)
    {
        _context = context;
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

    public Task<TModel?> GetByIdAsync(Guid id)
    {
        return Queryable.SingleOrDefaultAsync(user => user.Id == id);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    /*
    public async Task<bool> DeleteAsync(Guid id)
    {
        return Queryable.ExecuteDelete(user => user.Id == id);
    }*/
}