using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messages.Application.Data.Config;

public class GroupChatsConfig : IEntityTypeConfiguration<GroupChat>
{
    public void Configure(EntityTypeBuilder<GroupChat> builder)
    {
        builder
            .HasMany(u => u.AppUserGroupChats)
            .WithOne(m => m.GroupChat)
            .HasForeignKey(x => x.GroupChatId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder
            .HasMany(u => u.GroupChatMessages)
            .WithOne(m => m.GroupChat)
            .HasForeignKey(x => x.GroupChatId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        /*
        builder
            .HasMany(u => u.GroupChatServerMessages)
            .WithOne(m => m.GroupChat)
            .HasForeignKey(x => x.GroupChatId)
            .IsRequired();*/
    }
}
