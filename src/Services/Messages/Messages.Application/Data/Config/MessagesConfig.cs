using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Messages.Application.Data.Config;

public class MessagesConfig : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.Property(x => x.Id).IsRequired();

        builder.Property(x => x.Content).IsRequired();
        builder.Property(x => x.CreatedTime).IsRequired().HasDefaultValueSql("now()");
        builder.Property(x => x.LastModifiedTime).IsRequired().HasDefaultValueSql("now()");
        builder.Property(x => x.RecipientId).IsRequired();
        builder.Property(x => x.SenderId).IsRequired();
    }
}
