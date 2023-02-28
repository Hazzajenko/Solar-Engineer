using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Projects.API.Entities;

namespace Projects.API.Data.Config;

public class ProjectsConfig : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        // builder
        //     .HasMany(u => u.AppUserProjects)
        //     .WithOne(m => m.Project)
        //     .HasForeignKey(x => x.GroupChatMessageId)
        //     .OnDelete(DeleteBehavior.NoAction)
        //     .IsRequired();
    }
}