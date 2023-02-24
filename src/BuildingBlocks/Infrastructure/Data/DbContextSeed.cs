using Infrastructure.Common;

namespace Infrastructure.Data;

public class DbContextSeedUsers<TContext, TUser>
    where TContext : IDataContext
    where TUser : SharedUser, new()
{
    public async Task SeedUsersAsync(TContext context)
    {
        /*var defaultUser = await context.Users.FindAsync(Guid.Empty);
        if (defaultUser is null)
        {
            var user = new TUser
            {
                Id = Guid.NewGuid(),
                FirstName = "Default",
                LastName = "User",
                DisplayName = "Default User",
                PhotoUrl = "Empty"
            };
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }*/
    }
}