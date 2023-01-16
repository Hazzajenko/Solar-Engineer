using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class FriendRequestConfig : IEntityTypeConfiguration<FriendRequest>
{
    public void Configure(EntityTypeBuilder<FriendRequest> builder)
    {
        builder.HasOne(ur => ur.Notification)
            .WithOne(x => x.FriendRequest);
        /*.WithMany(u => u.Notifications)
        .HasForeignKey(ur => ur.AppUserId)
        .IsRequired();*/


        /*builder.HasMany(ur => ur.Connections)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/
    }
}