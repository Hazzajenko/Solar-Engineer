using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserConfig : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder.HasMany(ur => ur.AppUserProjects)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();

        builder.HasMany(ur => ur.SentFriendRequests)
            .WithOne(u => u.RequestedBy)
            .HasForeignKey(ur => ur.RequestedById)
            .IsRequired();

        builder.HasMany(ur => ur.ReceivedFriendRequests)
            .WithOne(u => u.RequestedTo)
            .HasForeignKey(ur => ur.RequestedToId)
            .IsRequired();

        builder.HasMany(ur => ur.MessagesSent)
            .WithOne(u => u.Sender)
            .HasForeignKey(ur => ur.SenderId)
            .IsRequired();

        builder.HasMany(ur => ur.MessagesReceived)
            .WithOne(u => u.Recipient)
            .HasForeignKey(ur => ur.RecipientId)
            .IsRequired();

        builder.HasMany(ur => ur.AppUserGroupChats)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();

        builder.HasMany(ur => ur.GroupChatMessagesSent)
            .WithOne(u => u.Sender)
            .HasForeignKey(ur => ur.SenderId)
            .IsRequired();

        /*
        builder.HasMany(ur => ur.Images)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();
            */

        /*
        builder.HasMany(ur => ur.Notifications)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/


        /*builder.HasMany(ur => ur.Connections)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/
    }
}