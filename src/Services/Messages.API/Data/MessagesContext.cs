using System.Reflection;
using Infrastructure.Data;
using Messages.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messages.API.Data;

public class MessagesContext
    : DbContext, IDataContext<User>
{
    public MessagesContext(DbContextOptions<MessagesContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = default!;
    public DbSet<Message> Messages { get; set; } = default!;
    public DbSet<UserGroupChat> UserGroupChats { get; set; } = default!;
    public DbSet<GroupChat> GroupChats { get; set; } = default!;
    public DbSet<GroupChatMessage> GroupChatMessages { get; set; } = default!;
    public DbSet<GroupChatServerMessage> GroupChatServerMessages { get; set; } = default!;

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
}