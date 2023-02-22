using Microsoft.EntityFrameworkCore;
using Users.API.Entities;

namespace Users.API.Data;

public class ConnectionsContext : DbContext
{
    public ConnectionsContext(DbContextOptions<ConnectionsContext>
        options) : base(options)
    {
    }

    public DbSet<UserConnection> UserConnections { get; set; } = default!;
    public DbSet<WebConnection> WebConnections { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserConnection>()
            .HasKey(x => x.UserId);

        modelBuilder.Entity<WebConnection>()
            .HasOne<UserConnection>(x => x.UserConnection)
            .WithMany(x => x.Connections)
            .HasForeignKey(x => x.UserId);
    }
}