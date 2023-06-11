using System.Reflection;
using Identity.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartEnum.EFCore;

namespace Identity.Application.Data;

public class IdentityContext
    : IdentityDbContext<
        AppUser,
        AppRole,
        Guid,
        IdentityUserClaim<Guid>,
        AppUserRole,
        IdentityUserLogin<Guid>,
        IdentityRoleClaim<Guid>,
        IdentityUserToken<Guid>
    >
{
    public IdentityContext(DbContextOptions<IdentityContext> options)
        : base(options) { }

    public DbSet<AppUserLink> AppUserLinks { get; set; } = default!;
    public DbSet<Notification> Notifications { get; set; } = default!;

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured)
            throw new Exception("No connection string configured, Identity API");
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}
