using Identity.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Application.Data.Config;

public class AppUserConfig : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()").IsRequired();

        builder.HasKey(x => x.Id);

        builder
            .HasMany(ur => ur.AppUserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder
            .HasMany(ur => ur.AppUserLinksRequested)
            .WithOne(x => x.AppUserRequested)
            .HasForeignKey(ur => ur.AppUserRequestedId)
            .IsRequired();

        builder
            .HasMany(ur => ur.AppUserLinksReceived)
            .WithOne(x => x.AppUserReceived)
            .HasForeignKey(ur => ur.AppUserReceivedId)
            .IsRequired();
    }
}