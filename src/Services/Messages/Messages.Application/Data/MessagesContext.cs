using System.Reflection;
using Infrastructure.Data;
using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messages.Application.Data;

public class MessagesContext : DbContext, IDataContext
{
    public MessagesContext(DbContextOptions<MessagesContext> options)
        : base(options) { }

    public DbSet<Message> Messages { get; set; } = default!;
    public DbSet<AppUserGroupChat> AppUserGroupChats { get; set; } = default!;
    public DbSet<GroupChat> GroupChats { get; set; } = default!;
    public DbSet<GroupChatMessage> GroupChatMessages { get; set; } = default!;
    public DbSet<GroupChatReadTime> GroupChatReadTimes { get; set; } = default!;

    // public DbSet<GroupChatServerMessage> GroupChatServerMessages { get; set; } = default!;

    protected override void OnConfiguring(DbContextOptionsBuilder options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
