using Identity.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Application.Data.Config;

public class NotificationConfig : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()").IsRequired();
        builder
            .Property(p => p.NotificationType)
            .HasConversion(p => p.Name, p => NotificationType.FromName(p, true));

        builder.Property(x => x.ProjectInvite).HasColumnType("jsonb");
        /*builder.OwnsOne(
            x => x.ProjectInvite,
            navigationsBuilder =>
            {
                // navigationsBuilder.OwnsOne(x => x.Data);
                // navigationsBuilder.Property(x => x.Data).;
                navigationsBuilder.ToJson();
            }
        );*/
    }
}
