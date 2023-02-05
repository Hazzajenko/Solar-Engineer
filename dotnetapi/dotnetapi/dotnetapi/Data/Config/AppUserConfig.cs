using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserConfig : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder
            .HasMany(ur => ur.AppUserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder
            .HasMany(ur => ur.AppUserProjects)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();

        builder
            .HasMany(ur => ur.MessagesSent)
            .WithOne(u => u.Sender)
            .HasForeignKey(ur => ur.SenderId)
            .IsRequired();

        builder
            .HasMany(ur => ur.MessagesReceived)
            .WithOne(u => u.Recipient)
            .HasForeignKey(ur => ur.RecipientId)
            .IsRequired();

        builder
            .HasMany(ur => ur.AppUserGroupChats)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();

        builder
            .HasMany(ur => ur.GroupChatMessagesSent)
            .WithOne(u => u.Sender)
            .HasForeignKey(ur => ur.SenderId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasMany(ur => ur.AppUserLinksSent)
            .WithOne(x => x.AppUserRequested)
            .HasForeignKey(ur => ur.AppUserRequestedId)
            .IsRequired();

        builder
            .HasMany(ur => ur.AppUserLinksReceived)
            .WithOne(x => x.AppUserReceived)
            .HasForeignKey(ur => ur.AppUserReceivedId)
            .IsRequired();

        builder
            .HasMany(ur => ur.NotificationsSent)
            .WithOne(x => x.NotificationFrom)
            .HasForeignKey(ur => ur.NotificationFromId)
            .IsRequired();

        builder
            .HasMany(ur => ur.NotificationsReceived)
            .WithOne(x => x.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();
    }
}