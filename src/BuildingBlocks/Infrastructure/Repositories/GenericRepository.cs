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