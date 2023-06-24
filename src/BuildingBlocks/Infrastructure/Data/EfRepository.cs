using ApplicationCore.Interfaces;
using Ardalis.Specification.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class EfRepository<TContext, TModel>
    : RepositoryBase<TModel>,
        IReadRepository<TModel>,
        IRepository<TModel>
    where TContext : DbContext
    where TModel : class, IEntity
{
    public EfRepository(TContext dbContext)
        : base(dbContext) { }
}
