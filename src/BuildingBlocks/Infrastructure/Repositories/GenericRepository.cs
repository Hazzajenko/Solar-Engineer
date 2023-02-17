using DotNetCore.EntityFrameworkCore;
using Infrastructure.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public abstract class GenericRepository<TContext, TModel> : EFRepository<TModel>, IGenericRepository<TModel>
    where TContext : DbContext
    where TModel : class, IEntity
{
    protected GenericRepository(TContext context) : base(context)
    {
    }

    public Task<TModel?> GetByIdAsync(Guid id)
    {
        return Queryable.SingleOrDefaultAsync(user => user.Id == id);
    }
}