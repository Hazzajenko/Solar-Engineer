namespace Projects.Application.Data.Config;

/*public class ProjectUsersConfig : IEntityTypeConfiguration<ProjectUser>
{
    public void Configure(EntityTypeBuilder<ProjectUser> builder)
    {
        builder.Property(x => x.Id).HasDefaultValueSql("uuid_generate_v4()");

        builder
            .HasMany(u => u.AppUserProjects)
            .WithOne(m => m.ProjectUser)
            .HasForeignKey(x => x.AppUserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}*/