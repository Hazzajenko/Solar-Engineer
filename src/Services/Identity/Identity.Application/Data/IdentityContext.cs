﻿using System.Reflection;
using Identity.Domain.Auth;
using Identity.Domain.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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
/*IdentityDbContext<
        AppUser,
        AppRole,
        int,
        AppUserRole,
        IdentityUserLogin<int>,
    >,
    IAuthContext*/
{
    public IdentityContext(DbContextOptions<IdentityContext> options)
        : base(options)
    {
        // Database.SetInitializer
        // Database.CurrentTransaction
    }

    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    // => optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");


    // public DbSet<AppUser> AppUsers { get; set; } = default!;
    public DbSet<UserLink> UserLinks { get; set; } = default!;

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

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }
}