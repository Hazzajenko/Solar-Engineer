using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.API.Entities;

namespace Projects.API.Data.Config;

public class PanelConfigsConfig : IEntityTypeConfiguration<PanelConfig>
{
    public void Configure(EntityTypeBuilder<PanelConfig> builder)
    {
        builder
            .Property(x => x.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        builder
            .HasMany(u => u.Panels)
            .WithOne(m => m.PanelConfig)
            .HasForeignKey(x => x.PanelConfigId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired();
    }
}