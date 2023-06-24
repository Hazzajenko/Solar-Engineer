using System.Linq.Expressions;
using Infrastructure.Common;

namespace Infrastructure.Repositories;

public interface IEntityToEntityRepository<TEntityToEntity>
    where TEntityToEntity : class, IEntityToEntity
{
    Task AddAsync(TEntityToEntity model);
    Task AddRangeAsync(IEnumerable<TEntityToEntity> items);
    Task<TEntityToEntity> AddAndSaveChangesAsync(TEntityToEntity model);
    Task<IEnumerable<TEntityToEntity>> AddManyAndSaveChangesAsync(
        IEnumerable<TEntityToEntity> items
    );
    Task UpdateAsync(TEntityToEntity item);
    Task<TEntityToEntity> UpdateAndSaveChangesAsync(TEntityToEntity model);
    Task<IEnumerable<TEntityToEntity>> UpdateManyAndSaveChangesAsync(
        IEnumerable<TEntityToEntity> items
    );
    object[] GetKeys(TEntityToEntity entity);
    Task<bool> FindAndDeleteAsync(Expression<Func<TEntityToEntity, bool>> where);
    Task<int> ExecuteDeleteAsync(Expression<Func<TEntityToEntity, bool>> predicate);
    Task DeleteAsync(object key);
}
