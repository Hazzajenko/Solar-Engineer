using System.Reflection;

using Auth.API.Domain;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.API.Data;

public class AuthContext
    
    : IdentityDbContext<
        AppUser,
        AppRole,
        int,
        IdentityUserClaim<int>,
        AppUserRole,
        IdentityUserLogin<int>,
        IdentityRoleClaim<int>,
        IdentityUserToken<int>
    >, IAuthContext, IDbContext 
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
    }



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

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // => optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");
}

