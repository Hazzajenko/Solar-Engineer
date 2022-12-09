using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppRoleConfig : IEntityTypeConfiguration<AppRole> {
    public void Configure(EntityTypeBuilder<AppRole> builder) {
        builder.HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();
    }
}