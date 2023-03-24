using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Projects.Application.Data.Config;

public class StringsConfig : IEntityTypeConfiguration<String>
{
    public void Configure(EntityTypeBuilder<String> builder)
    {
        builder.HasKey(x => new { x.Id, x.ProjectId });

        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");

        builder
            .HasMany(u => u.Panels)
            .WithOne(m => m.String)
            .HasForeignKey(x => x.StringId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder
            .HasMany(u => u.PanelLinks)
            .WithOne(m => m.String)
            .HasForeignKey(x => x.StringId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        // builder.
    }
}