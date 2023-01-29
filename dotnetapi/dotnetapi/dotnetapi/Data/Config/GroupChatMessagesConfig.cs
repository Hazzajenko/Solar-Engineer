using dotnetapi.Features.GroupChats.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class GroupChatMessagesConfig : IEntityTypeConfiguration<GroupChatMessage>
{
    public void Configure(EntityTypeBuilder<GroupChatMessage> builder)
    {
        /*builder
            .HasOne(u => u.GroupChat)
            .WithMany(m => m.GroupChatMessages)
            .HasForeignKey(x => x.GroupChatId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired();*/

        /*builder
            .HasOne(u => u.Sender)
            .WithMany(m => m.GroupChatMessagesSent)
            .HasForeignKey(x => x.SenderId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired();*/

        builder
            .HasMany(u => u.MessageReadTimes)
            .WithOne(m => m.GroupChatMessage)
            .HasForeignKey(x => x.GroupChatMessageId)
            .OnDelete(DeleteBehavior.NoAction)
            .IsRequired();
    }
}