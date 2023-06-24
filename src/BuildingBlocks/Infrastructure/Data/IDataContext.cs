namespace Infrastructure.Data;

public interface IDataContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
