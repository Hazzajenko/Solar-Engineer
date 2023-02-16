using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Users.API.Entities;

namespace Users.API.Data.Config;

public class UserConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // builder.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid ()").IsRequired();

        builder
            .HasKey(x => x.Id);

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