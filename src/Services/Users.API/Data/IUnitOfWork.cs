using Microsoft.EntityFrameworkCore.ChangeTracking;
using Users.API.Repositories;

namespace Users.API.Data
{
    public interface IUnitOfWork
    {
        EntityEntry<TEntity> Attach<TEntity>(TEntity entity) where TEntity : class;
        IUsersRepository UsersRepository {get; }
        IUserLinksRepository UserLinksRepository {get;}
        Task<bool> Complete();
        bool HasChanges();
    }
}