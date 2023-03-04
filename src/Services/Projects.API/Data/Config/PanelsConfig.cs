using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.API.Entities;

namespace Projects.API.Data.Config;

public class PanelsConfig : IEntityTypeConfiguration<Panel>
{
    public void Configure(EntityTypeBuilder<Panel> builder)
    {
        builder
            .Property(x => x.Id)
            .HasDefaultValueSql("uuid_generate_v4()");

        /*builder
            .Property(x => x.StringId)
            .HasDefaultValueSql("uuid_generate_v4()").IsRequired();*/

        // builder.
    }
}