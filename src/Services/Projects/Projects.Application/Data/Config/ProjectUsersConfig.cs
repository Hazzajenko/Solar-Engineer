using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Config;

public class ProjectUsersConfig : IEntityTypeConfiguration<ProjectUser>
{
    public void Configure(EntityTypeBuilder<ProjectUser> builder)
    {
        builder.Property(x => x.Id).IsRequired();
        builder.Property(x => x.SelectedProjectId).IsRequired(false);
        builder
            .HasMany(u => u.AppUserProjects)
            .WithOne(m => m.ProjectUser)
            .HasForeignKey(x => x.AppUserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}
