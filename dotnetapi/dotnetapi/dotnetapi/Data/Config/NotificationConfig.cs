using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class NotificationConfig : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        /*builder
            .HasOne(c => c.FriendRequest)
            .WithOne(x => x.Notification)
            .HasForeignKey<Notification>(c => c.FriendRequestId);*/

        /*builder
            .HasOne(c => c.AppUserFriend)
            .WithOne(x => x.Notification)
            // .HasPrincipalKey(x => x.)
            .HasForeignKey<Notification>(c => new { c.AppUserId, c.AppUserFriendId });*/

        /*builder.OwnsOne(x => x.FriendRequest)
            .WithOwner(x => x.Notification)
            .HasForeignKey(c => c.NotificationId);*/

        /*builder.OwnsOne(x => x.AppUserFriend)
            .WithOwner(x => x.Notification)
            .HasForeignKey(c => c.NotificationId);*/

        /*builder
            .HasOne(c => c.FriendRequest).WithOne(x => x.)
            .WithOptional(c => c.Country)
            .HasForeignKey(c => c.CountryId)
            .WillCascadeOnDelete(false);*/

        /*builder.HasOne(ur => ur.AppUser)
            .WithMany(u => u.Notifications)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/


        /*builder.HasMany(ur => ur.Connections)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/
    }
}