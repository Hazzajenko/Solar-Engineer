using System.Reflection;
using Duende.IdentityServer.Models;
using Infrastructure.Data;
using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messages.Application.Data;

public class MessagesContext
    : DbContext, IDataContext
{
    public MessagesContext(DbContextOptions<MessagesContext> options)
        : base(options)
    {
    }

    public DbSet<AppUserGroupChat> UserGroupChats { get; set; } = default!;
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