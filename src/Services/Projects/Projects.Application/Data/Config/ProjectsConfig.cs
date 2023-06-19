using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Config;

public class ProjectsConfig : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");

        builder.Property(x => x.UndefinedStringId).HasDefaultValueSql("uuid_generate_v4()");

        /*builder
            .HasOne(x => x.UndefinedString)
            .WithOne(x => x.Project)
            .HasForeignKey<String>(x => x.Id)
            // .HasPrincipalKey<String>(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();*/

        builder
            .HasMany(u => u.AppUserProjects)
            .WithOne(m => m.Project)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder
            .HasMany(u => u.Panels)
            .WithOne(m => m.Project)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder
            .HasMany(u => u.PanelLinks)
            .WithOne(m => m.Project)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder
            .HasMany(u => u.Strings)
            .WithOne(m => m.Project)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}
