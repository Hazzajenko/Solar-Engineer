using Infrastructure.Common;

namespace Infrastructure.Repositories;

public interface IGenericRepository<TModel>
    where TModel : class, IEntity
{
    Task AddAsync(TModel model);
    Task<TModel?> GetByIdAsync(Guid id);
    Task AddRangeAsync(IEnumerable<TModel> items);

    Task DeleteAsync(object key);
    // Task<bool> DeleteAsync(Guid id);
}