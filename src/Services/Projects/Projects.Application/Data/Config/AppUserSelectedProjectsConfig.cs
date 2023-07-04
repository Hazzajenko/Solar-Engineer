using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Config;

public class AppUserSelectedProjectsConfig : IEntityTypeConfiguration<AppUserSelectedProject>
{
    public void Configure(EntityTypeBuilder<AppUserSelectedProject> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.ProjectId).IsRequired(false);
        builder.Property(x => x.CreatedTime).IsRequired().HasDefaultValueSql("now()");
        builder.Property(x => x.LastModifiedTime).IsRequired().HasDefaultValueSql("now()");
    }
}
