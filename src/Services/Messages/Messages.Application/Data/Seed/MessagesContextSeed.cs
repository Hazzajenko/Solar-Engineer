namespace Messages.Application.Data.Seed;

public static class MessagesContextSeed
{
    /*public static async Task SeedAsync(this MessagesContext context)
    {
        var defaultUser = await context.Users.FindAsync(Guid.Empty);
        if (defaultUser is null)
        {
            await context.Users.SeedUsers();
            await context.SaveChangesAsync();
            defaultUser = await context.Users.FindAsync(Guid.Empty);
        }
    }

    private static async Task SeedUsers(this DbSet<User> users)
    {
        var user = new User
        {
            Id = Guid.Empty,
            FirstName = "Default",
            LastName = "User",
            DisplayName = "Default User",
            PhotoUrl = "Empty"
        };
        await users.AddAsync(user);
    }*/
}