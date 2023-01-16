using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserFriendConfig : IEntityTypeConfiguration<AppUserFriend>
{
    public void Configure(EntityTypeBuilder<AppUserFriend> builder)
    {
        // builder.HasKey(x => x.Id);

        builder.HasKey(f => new { f.RequestedById, f.RequestedToId });

        builder.HasOne(a => a.RequestedBy)
            .WithMany(b => b.SentFriendRequests)
            .HasForeignKey(c => c.RequestedById)
            .IsRequired();
        // .OnDelete(DeleteBehavior.ClientNoAction)

        builder.HasOne(a => a.RequestedTo)
            .WithMany(b => b.ReceivedFriendRequests)
            .HasForeignKey(c => c.RequestedToId)
            .IsRequired();
        // .OnDelete(DeleteBehavior.ClientNoAction)
    }
}

// .HasKey(f => new { f.RequestedById , f.RequestedToId });