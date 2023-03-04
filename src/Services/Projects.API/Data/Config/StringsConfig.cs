using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Projects.API.Data.Config;

public class StringsConfig : IEntityTypeConfiguration<String>
{
    public void Configure(EntityTypeBuilder<String> builder)
    {
        builder
            .Property(x => x.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        builder
            .HasMany(u => u.Panels)
            .WithOne(m => m.String)
            .HasForeignKey(x => x.StringId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();

        // builder.
    }
}