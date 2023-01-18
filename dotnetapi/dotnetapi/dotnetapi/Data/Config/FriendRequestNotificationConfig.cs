using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class FriendRequestNotificationConfig : IEntityTypeConfiguration<FriendRequestNotification>
{
    public void Configure(EntityTypeBuilder<FriendRequestNotification> builder)
    {
        /*builder.HasOne(ur => ur.RequestedBy)
            .WithMany(x => x.FriendRequestNotifications)
            .HasForeignKey(x => x.RequestedById)
            .IsRequired();

        builder.HasOne(ur => ur.RequestedTo)
            .WithMany(x => x.FriendRequestNotifications)
            .HasForeignKey(x => x.RequestedToId)
            .IsRequired();*/
        /*.WithMany(u => u.Notifications)
        .HasForeignKey(ur => ur.AppUserId)
        .IsRequired();*/


        /*builder.HasMany(ur => ur.Connections)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/
    }
}