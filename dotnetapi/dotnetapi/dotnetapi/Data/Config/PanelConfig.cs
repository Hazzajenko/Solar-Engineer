using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class PanelConfig : IEntityTypeConfiguration<Panel>
{
    public void Configure(EntityTypeBuilder<Panel> builder)
    {
        builder.HasOne(ur => ur.PositiveTo)
            .WithOne(u => u.PositiveTo)
            .HasForeignKey<PanelLink>(ur => ur.PositiveToId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired();

        builder.HasOne(ur => ur.NegativeTo)
            .WithOne(u => u.NegativeTo)
            .HasForeignKey<PanelLink>(ur => ur.NegativeToId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired();

        builder.HasOne(ur => ur.DisconnectionPointPanelLink)
            .WithOne(u => u.DisconnectionPointPanel)
            .HasForeignKey<PanelLink>(ur => ur.DisconnectionPointPanelId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}