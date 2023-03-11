﻿using System.Linq.Expressions;
using Infrastructure.Common;

namespace Infrastructure.Repositories;

public interface IGenericRepository<TModel>
    where TModel : class, IEntity
{
    Task AddAsync(TModel model);
    Task<TModel> AddAndSaveChangesAsync(TModel model);
    Task AddRangeAsync(IEnumerable<TModel> items);
    Task<IEnumerable<TModel>> AddManyAndSaveChangesAsync(IEnumerable<TModel> items);
    Task<TModel?> GetByIdAsync(Guid id);
    Task UpdateAsync(TModel item);
    Task<TModel> UpdateAndSaveChangesAsync(TModel model);
    Task<bool> FindAndDeleteAsync(Expression<Func<TModel, bool>> where);
    Task<bool> FindManyAndDeleteAsync(Expression<Func<TModel, bool>> where);
    object[] GetKeys(TModel entity);

    Task DeleteAsync(object key);
    // Task<bool> DeleteAsync(Guid id);
}