using Identity.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Application.Data.Config;

public class AppUserLinkConfig : IEntityTypeConfiguration<AppUserLink>
{
    public void Configure(EntityTypeBuilder<AppUserLink> builder)
    {
        builder.HasKey(f => new { f.AppUserRequestedId, f.AppUserReceivedId });
        builder
            .Property(p => p.AppUserReceivedFriendRequestStatus)
            .HasConversion(p => p.Name, p => FriendRequestStatus.FromName(p, true));
        builder
            .Property(p => p.AppUserRequestedFriendRequestStatus)
            .HasConversion(p => p.Name, p => FriendRequestStatus.FromName(p, true));
    }
}
