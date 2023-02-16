using System.Reflection;
using DotNetCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Users.API.Entities;

namespace Users.API.Data;

public class UsersContext
    : DbContext, ITrackContext, IUsersContext
{
    public UsersContext(DbContextOptions<UsersContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = default!;
    public DbSet<UserLink> UserLinks { get; set; } = default!;

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured)
            options.UseNpgsql(
                "Server=localhost;Port=5432;Database=SolarEngineer.UsersDb;User ID=postgres;Password=password;"
            );
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public async Task<int> SaveChangesAsync()
    {
       return await base.SaveChangesAsync();
    }
}