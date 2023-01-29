using dotnetapi.Features.GroupChats.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserGroupChatConfig : IEntityTypeConfiguration<AppUserGroupChat>
{
    public void Configure(EntityTypeBuilder<AppUserGroupChat> builder)
    {
        builder.HasKey(x => x.Id);

        // builder.HasKey(f => new { f.RequestedById, f.RequestedToId });

        /*builder.HasOne(a => a.AppUser)
            .WithMany(b => b.AppUserGroupChats)
            .HasForeignKey(c => c.AppUserId)
            .IsRequired();*/
        // .OnDelete(DeleteBehavior.ClientNoAction)

        /*
        builder.HasOne(a => a.GroupChat)
            .WithMany(b => b.AppUserGroupChats)
            .HasForeignKey(c => c.GroupChatId)
            .IsRequired();*/
        // .OnDelete(DeleteBehavior.Cascade);
        // .OnDelete(DeleteBehavior.ClientNoAction)
    }
}

// .HasKey(f => new { f.RequestedById , f.RequestedToId });