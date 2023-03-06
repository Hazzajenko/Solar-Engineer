﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.API.Entities;

namespace Projects.API.Data.Config;

public class AppUserProjectsConfig : IEntityTypeConfiguration<AppUserProject>
{
    public void Configure(EntityTypeBuilder<AppUserProject> builder)
    {
        builder.HasKey(x => new { x.AppUserId, x.ProjectId });

        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");

        /*builder
            .HasOne(u => u.Project)
            .WithMany(m => m.AppUserProjects)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired();*/
    }
}