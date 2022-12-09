﻿using System.Reflection;
using System.Text.RegularExpressions;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using String = dotnetapi.Models.Entities.String;


namespace dotnetapi.Data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
    IdentityRoleClaim<int>, IdentityUserToken<int>> {

    public DataContext(DbContextOptions<DataContext> options) : base(options) {
    }
    
    // public DbSet<Group> Groups { get; set; } = default!;
    // public DbSet<Connection> Connections { get; set; } = default!;
    public DbSet<Project> Projects { get; set; } = default!;
    public DbSet<String> Strings { get; set; } = default!;
    public DbSet<Panel> Panels { get; set; } = default!;
    public DbSet<PanelLink> PanelLinks { get; set; } = default!;
    public DbSet<AppUserProject> AppUserProjects { get; set; } = default!;
    
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        if (!options.IsConfigured)
        {
            options.UseNpgsql("Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");
        }
    }


    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);


        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
    
    // protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        // => optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=solardotnetbackend;User ID=postgres;Password=password;");
}