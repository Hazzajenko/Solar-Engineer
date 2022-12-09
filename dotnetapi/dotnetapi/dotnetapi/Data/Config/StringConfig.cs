using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using String = dotnetapi.Models.Entities.String;
namespace dotnetapi.Data.Config;

public class StringConfig : IEntityTypeConfiguration<String> {
    public void Configure(EntityTypeBuilder<String> builder) {
        builder.HasMany(ur => ur.PanelLinks)
            .WithOne(u => u.String)
            .HasForeignKey(ur => ur.StringId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        builder.HasMany(ur => ur.Panels)
            .WithOne(u => u.String)
            .HasForeignKey(ur => ur.StringId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}