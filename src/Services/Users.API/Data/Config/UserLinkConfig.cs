using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Users.API.Entities;

namespace Users.API.Data.Config;

public class UserLinkConfig : IEntityTypeConfiguration<UserLink>
{
    public void Configure(EntityTypeBuilder<UserLink> builder)
    {
        /*builder.Property(x => x.Id).HasDefaultValueSql("gen_random_uuid ()").IsRequired();

        builder
            .HasKey(x => x.Id);*/
        builder.HasKey(f => new { f.AppUserRequestedId, f.AppUserReceivedId });
    }
}