


using Microsoft.EntityFrameworkCore.ChangeTracking;
using Users.API.Repositories;

namespace Users.API.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly UsersContext _context;
        public UnitOfWork(UsersContext context)
        {
            _context = context;
        }

        public EntityEntry<TEntity> Attach<TEntity>(TEntity entity) where TEntity : class
        {
           return _context.Attach(entity);
        }

        public IUsersRepository UsersRepository => new UsersRepository(_context);
        public IUserLinksRepository UserLinksRepository=> new UserLinksRepository(_context);

        public async Task<bool> Complete()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public bool HasChanges()
        {
            _context.ChangeTracker.DetectChanges();
            var changes = _context.ChangeTracker.HasChanges();

            return changes;
        }

    }
}