using Messages.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messages.API.Data.Config;

public class GroupChatsConfig : IEntityTypeConfiguration<GroupChat>
{
    public void Configure(EntityTypeBuilder<GroupChat> builder)
    {
        builder
            .HasMany(u => u.UserGroupChats)
            .WithOne(m => m.GroupChat)
            .HasForeignKey(x => x.GroupChatId)
            .IsRequired();

        /*builder
            .HasMany(u => u.GroupChatServerMessages)
            .WithOne(m => m.GroupChat)
            .HasForeignKey(x => x.GroupChatId)
            .IsRequired();*/

        builder
            .HasMany(u => u.GroupChatMessages)
            .WithOne(m => m.GroupChat)
            .HasForeignKey(x => x.GroupChatId)
            .IsRequired();
    }
}