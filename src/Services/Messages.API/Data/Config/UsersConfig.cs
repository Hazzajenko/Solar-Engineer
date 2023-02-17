using Messages.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messages.API.Data.Config;

public class UsersConfig : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
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
            .HasMany(ur => ur.UserGroupChats)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder
            .HasMany(ur => ur.GroupChatMessagesSent)
            .WithOne(u => u.Sender)
            .HasForeignKey(ur => ur.SenderId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}