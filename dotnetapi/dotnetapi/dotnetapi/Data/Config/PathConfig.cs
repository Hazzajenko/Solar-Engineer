using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Path = dotnetapi.Models.Entities.Path;

namespace dotnetapi.Data.Config;

public class PathConfig : IEntityTypeConfiguration<Path>
{
    public void Configure(EntityTypeBuilder<Path> builder)
    {
    }
}