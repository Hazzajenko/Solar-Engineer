using dotnetapi.Features.Conversations.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserConversationConfig : IEntityTypeConfiguration<AppUserConversation>
{
    public void Configure(EntityTypeBuilder<AppUserConversation> builder)
    {
        builder.HasKey(x => x.Id);

        // builder.HasKey(f => new { f.RequestedById, f.RequestedToId });

        builder.HasOne(a => a.AppUser)
            .WithMany(b => b.AppUserConversations)
            .HasForeignKey(c => c.AppUserId)
            .IsRequired();
        // .OnDelete(DeleteBehavior.ClientNoAction)

        builder.HasOne(a => a.Conversation)
            .WithMany(b => b.AppUserConversations)
            .HasForeignKey(c => c.ConversationId)
            .IsRequired();
        // .OnDelete(DeleteBehavior.Cascade);
        // .OnDelete(DeleteBehavior.ClientNoAction)
    }
}

// .HasKey(f => new { f.RequestedById , f.RequestedToId });