using System.Reflection;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Path = dotnetapi.Models.Entities.Path;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects { get; set; } = default!;
    public DbSet<String> Strings { get; set; } = default!;
    public DbSet<Panel> Panels { get; set; } = default!;
    public DbSet<PanelLink> PanelLinks { get; set; } = default!;
    public DbSet<Path> Paths { get; set; } = default!;
    public DbSet<AppUserProject> AppUserProjects { get; set; } = default!;
    public DbSet<AppUserGroupChat> AppUserGroupChats { get; set; } = default!;

    public DbSet<AppUserFriend> AppUserFriends { get; set; } = default!;

    public DbSet<Group> Groups { get; set; } = default!;
    public DbSet<GroupChat> GroupChats { get; set; } = default!;

    public DbSet<Message> Messages { get; set; } = default!;

    public DbSet<GroupChatMessage> GroupChatMessages { get; set; } = default!;

    public DbSet<GroupChatReadTime> GroupChatReadTimes { get; set; } = default!;
    // public DbSet<Notification> Notifications { get; set; } = default!;

    // public DbSet<FriendRequest> FriendRequests { get; set; } = default!;
    // public DbSet<FriendRequestNotification> FriendRequestNotifications { get; set; } = default!;

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured)
            options.UseNpgsql(
                "Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");
    }


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);


        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // => optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");
}