using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Config;

public class AppUserProjectsConfig : IEntityTypeConfiguration<AppUserProject>
{
    public void Configure(EntityTypeBuilder<AppUserProject> builder)
    {
        builder.HasKey(x => new { x.ProjectUserId, x.ProjectId });

        builder.Property(x => x.CreatedTime).HasDefaultValueSql("now()");
        builder.Property(x => x.LastModifiedTime).HasDefaultValueSql("now()");
        builder.Property(x => x.Role).IsRequired();
        builder.Property(x => x.CanCreate).IsRequired();
        builder.Property(x => x.CanDelete).IsRequired();
        builder.Property(x => x.CanInvite).IsRequired();
        builder.Property(x => x.CanKick).IsRequired();
    }
}