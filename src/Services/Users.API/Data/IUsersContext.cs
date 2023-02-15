namespace Users.API.Data;

public interface IUsersContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}