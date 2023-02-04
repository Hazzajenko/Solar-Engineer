using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserLinkConfig : IEntityTypeConfiguration<AppUserLink>
{
    public void Configure(EntityTypeBuilder<AppUserLink> builder)
    {
        // builder.HasKey(x => x.Id);

        // builder.HasOne(x => x.)

        builder.HasKey(f => new { f.AppUserRequestedId, f.AppUserReceivedId });

        /*builder.HasOne(a => a.AppUserOne)
            .WithMany(b => b.SentFriendRequests)
            .HasForeignKey(c => c.RequestedById)
            .IsRequired();
        // .OnDelete(DeleteBehavior.ClientNoAction)

        builder.HasOne(a => a.RequestedTo)
            .WithMany(b => b.ReceivedFriendRequests)
            .HasForeignKey(c => c.RequestedToId)
            .IsRequired();*/
        // .OnDelete(DeleteBehavior.ClientNoAction)
    }
}

// .HasKey(f => new { f.RequestedById , f.RequestedToId });