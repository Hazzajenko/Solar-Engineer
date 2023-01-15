using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace dotnetapi.Data.Config;

public class AppUserConfig : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

        builder.HasMany(ur => ur.AppUserProjects)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();

        builder.HasMany(ur => ur.SentFriendRequests)
            .WithOne(u => u.RequestedBy)
            .HasForeignKey(ur => ur.RequestedById)
            .IsRequired();

        builder.HasMany(ur => ur.ReceivedFriendRequests)
            .WithOne(u => u.RequestedTo)
            .HasForeignKey(ur => ur.RequestedToId)
            .IsRequired();


        /*builder.HasMany(ur => ur.Connections)
            .WithOne(u => u.AppUser)
            .HasForeignKey(ur => ur.AppUserId)
            .IsRequired();*/
    }
}