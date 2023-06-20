using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Config;

public class PanelLinksConfig : IEntityTypeConfiguration<PanelLink>
{
    public void Configure(EntityTypeBuilder<PanelLink> builder)
    {
        builder.HasKey(x => new { x.Id, x.ProjectId });

        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");

        builder
            .HasOne(x => x.PanelPositiveTo)
            .WithOne(x => x.LinkNegativeTo)
            .HasForeignKey<Panel>(x => x.LinkNegativeToId)
            .HasPrincipalKey<PanelLink>(x => x.Id)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(x => x.PanelNegativeTo)
            .WithOne(x => x.LinkPositiveTo)
            .HasForeignKey<Panel>(x => x.LinkPositiveToId)
            .HasPrincipalKey<PanelLink>(x => x.Id)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(x => x.Points).HasColumnType("jsonb");
    }
}
