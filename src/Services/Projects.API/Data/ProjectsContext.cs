﻿using System.Reflection;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Projects.API.Entities;

namespace Projects.API.Data;

public class ProjectsContext : DbContext, IDataContext
{
    public ProjectsContext(DbContextOptions<ProjectsContext> options)
        : base(options)
    {
    }

    public DbSet<Project> Projects { get; set; } = default!;
    public DbSet<AppUserProject> AppUserProjects { get; set; } = default!;
    public DbSet<String> Strings { get; set; } = default!;
    public DbSet<Panel> Panels { get; set; } = default!;
    public DbSet<PanelLink> PanelLinks { get; set; } = default!;
    public DbSet<PanelConfig> PanelConfigs { get; set; } = default!;

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