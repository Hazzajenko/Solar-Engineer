using Infrastructure.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public interface IDataContext<TUser>
where TUser : SharedUser
{
    DbSet<TUser> Users { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}