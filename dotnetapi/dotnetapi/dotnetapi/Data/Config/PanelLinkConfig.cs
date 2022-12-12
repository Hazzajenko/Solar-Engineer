﻿using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class PanelLinkConfig : IEntityTypeConfiguration<PanelLink>
{
    public void Configure(EntityTypeBuilder<PanelLink> builder)
    {
        builder.HasOne(ur => ur.PositiveTo)
            .WithOne(u => u.PositiveTo)
            .HasForeignKey<PanelLink>(ur => ur.PositiveToId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.HasOne(ur => ur.NegativeTo)
            .WithOne(u => u.NegativeTo)
            .HasForeignKey<PanelLink>(ur => ur.NegativeToId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.HasOne(ur => ur.DisconnectionPointPanel)
            .WithOne(u => u.DisconnectionPointPanelLink)
            .HasForeignKey<PanelLink>(ur => ur.DisconnectionPointPanelId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}