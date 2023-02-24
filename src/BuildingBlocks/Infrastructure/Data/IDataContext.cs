namespace Infrastructure.Data;

public interface IDataContext
// where TUser : SharedUser
{
    // DbSet<TUser> Users { get; set; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}