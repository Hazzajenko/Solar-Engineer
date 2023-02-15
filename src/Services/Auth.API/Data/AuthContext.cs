using System.Reflection;
using DotNetCore.EntityFrameworkCore;
using Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.API.Data;

public class AuthContext
    : IdentityDbContext<
        AppUser,
        AppRole,
        Guid,
        IdentityUserClaim<Guid>,
        AppUserRole,
        IdentityUserLogin<Guid>,
        IdentityRoleClaim<Guid>,
        IdentityUserToken<Guid>
    >, IAuthContext, IDbContext, IUnitOfWork
    /*IdentityDbContext<
            AppUser,
            AppRole,
            int,
            AppUserRole,
            IdentityUserLogin<int>,
        >,
        IAuthContext*/
{
    public AuthContext(DbContextOptions<AuthContext> options)
        : base(options)
    {
        // Database.SetInitializer
        // Database.CurrentTransaction
    }

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // => optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");
    public async Task<int> SaveChangesAsync()
    {
        return await base.SaveChangesAsync();
    }

    // public DbSet<AppUser> AppUsers { get; set; } = default!;

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured)
            options.UseNpgsql(
                "Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;"
            );
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}