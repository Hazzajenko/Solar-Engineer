using Identity.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Identity.Application.Data.Config;

public class AppUserLinkConfig : IEntityTypeConfiguration<AppUserLink>
{
    public void Configure(EntityTypeBuilder<AppUserLink> builder)
    {
        builder.HasKey(f => new { f.AppUserRequestedId, f.AppUserReceivedId });
    }
}