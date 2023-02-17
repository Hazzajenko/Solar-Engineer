using Infrastructure.Common;

namespace Infrastructure.Repositories;

public interface IGenericRepository<TModel>
    where TModel : class, IEntity
{
    Task AddAsync(TModel model);
    Task<TModel?> GetByIdAsync(Guid id);
}