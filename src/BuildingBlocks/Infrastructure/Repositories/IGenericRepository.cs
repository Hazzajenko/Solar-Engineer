using System.Linq.Expressions;
using Infrastructure.Common;
using Microsoft.EntityFrameworkCore.Query;

namespace Infrastructure.Repositories;

public interface IGenericRepository<TModel>
    where TModel : class, IEntity
{
    Task AddAsync(TModel model);
    Task<TModel> AddAndSaveChangesAsync(TModel model);
    Task AddRangeAsync(IEnumerable<TModel> items);
    Task<IEnumerable<TModel>> AddManyAndSaveChangesAsync(IEnumerable<TModel> items);
    Task<TModel?> GetByIdAsync(Guid id);
    Task<TModel?> GetByIdNoTracking(Guid id);
    Task UpdateAsync(TModel item);
    Task UpdateRangeAsync(IEnumerable<TModel> items);

    Task<int> ExecuteUpdateAsync(Expression<Func<SetPropertyCalls<TModel>, SetPropertyCalls<TModel>>> updateFunc);
    Task<TModel> UpdateAndSaveChangesAsync(TModel model);
    Task<IEnumerable<TModel>> UpdateManyAndSaveChangesAsync(IEnumerable<TModel> items);
    Task<bool> FindAndDeleteAsync(Expression<Func<TModel, bool>> where);
    Task<bool> FindManyAndDeleteAsync(Expression<Func<TModel, bool>> where);
    object[] GetKeys(TModel entity);

    Task DeleteAsync(object key);
    // Task<bool> DeleteAsync(Guid id);
}
