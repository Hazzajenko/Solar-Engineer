using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class ProjectConfig : IEntityTypeConfiguration<Project> {
    public void Configure(EntityTypeBuilder<Project> builder) {
        builder.HasMany(ur => ur.AppUserProjects)
            .WithOne(u => u.Project)
            .HasForeignKey(ur => ur.ProjectId)
            .IsRequired();
        
        builder.HasMany(ur => ur.Strings)
            .WithOne(u => u.Project)
            .HasForeignKey(ur => ur.ProjectId)
            .IsRequired();
    }
}