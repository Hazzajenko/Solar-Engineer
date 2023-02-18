﻿using Auth.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auth.API.Data.Config;

public class AppUserConfig : IEntityTypeConfiguration<AuthUser>
{
    public void Configure(EntityTypeBuilder<AuthUser> builder)
    {
        builder.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid ()").IsRequired();

        builder
            .HasKey(x => x.Id);

        builder
            .HasMany(ur => ur.AppUserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();
    }
}