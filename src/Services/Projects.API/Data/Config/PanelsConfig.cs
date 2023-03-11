using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.API.Entities;

namespace Projects.API.Data.Config;

public class PanelsConfig : IEntityTypeConfiguration<Panel>
{
    public void Configure(EntityTypeBuilder<Panel> builder)
    {
        builder.HasKey(x => new { x.Id, x.ProjectId });

        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");

        /*builder
            .HasOne(x => x.LinkPositiveTo)
            .WithOne(x => x.PanelNegativeTo)
            .HasForeignKey<PanelLink>(x => x.PanelNegativeToId)
            .HasPrincipalKey<Panel>(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.LinkNegativeTo)
            .WithOne(x => x.PanelPositiveTo)
            .HasForeignKey<PanelLink>(x => x.PanelPositiveToId)
            .HasPrincipalKey<Panel>(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);*/


        // builder.
    }
}