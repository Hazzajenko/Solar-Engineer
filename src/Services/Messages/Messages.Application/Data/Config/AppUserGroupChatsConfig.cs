using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messages.Application.Data.Config;

public class AppUserGroupChatsConfig : IEntityTypeConfiguration<AppUserGroupChat>
{
    public void Configure(EntityTypeBuilder<AppUserGroupChat> builder)
    {
        builder.HasKey(x => new { x.AppUserId, x.GroupChatId });

        builder.Property(x => x.CreatedTime).IsRequired().HasDefaultValueSql("now()");
        builder.Property(x => x.LastModifiedTime).IsRequired().HasDefaultValueSql("now()");
        builder.Property(x => x.Role).IsRequired();
        builder.Property(x => x.CanInvite).IsRequired();
        builder.Property(x => x.CanKick).IsRequired();
    }
}
