using dotnetapi.Models.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Data;

public class InMemoryDatabase : DbContext
{
    public InMemoryDatabase(DbContextOptions<InMemoryDatabase>
        options) : base(options)
    {
    }

    // public DbSet<UserConnection> Connections { get; set; }
    public DbSet<UserConnection> UserConnections { get; set; }
    public DbSet<WebConnection> WebConnections { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserConnection>()
            .HasKey(x => x.UserId);

        modelBuilder.Entity<WebConnection>()
            .HasOne<UserConnection>(x => x.User)
            .WithMany(x => x.Connections)
            .HasForeignKey(x => x.UserId)
            // .HasKey(x => x.Id);
            // .HasNoKey();
            /*modelBuilder.Entity<UserConnection>()
                .HasMany<ConnectionId>(x => x.ConnectionIds)
                .WithOne(x => x.UserConnection)
                .HasForeignKey(ur => ur.UserConnectionId)
                .IsRequired();
    
            modelBuilder.Entity<ConnectionId>()
                .HasOne(x => x.UserConnection)
                .WithMany(x => x.ConnectionIds)
                .HasForeignKey(ur => ur.Id)
                .IsRequired();*/
            ;

        // modelBuilder.Entity<ConnectionId>()
        //     .HasOne(ur => ur.AppUser)
        //     /*.WithOne(u => u.)
        //     .HasForeignKey<PanelLink>(ur => ur.PositiveToId)
        //     .OnDelete(DeleteBehavior.SetNull)*/
        //     .IsRequired();
    }
}