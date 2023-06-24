using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messages.Application.Data.Config;

public class GroupChatMessagesConfig : IEntityTypeConfiguration<GroupChatMessage>
{
    public void Configure(EntityTypeBuilder<GroupChatMessage> builder)
    {
        builder
            .HasMany(u => u.MessageReadTimes)
            .WithOne(m => m.GroupChatMessage)
            .HasForeignKey(x => x.GroupChatMessageId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}
