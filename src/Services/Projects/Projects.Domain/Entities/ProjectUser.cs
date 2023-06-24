using ApplicationCore.Interfaces;

namespace Projects.Domain.Entities;

public class ProjectUser : IEntity
{
    public ProjectUser(Guid id, string userName, string displayName, string photoUrl)
    {
        Id = id;
        UserName = userName;
        DisplayName = displayName;
        PhotoUrl = photoUrl;
        CreatedTime = DateTime.UtcNow;
        LastModifiedTime = DateTime.UtcNow;
    }

    public ProjectUser() { }

    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;

    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public string UserName { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;

    public static ProjectUser Create(Guid id, string userName, string displayName, string photoUrl)
    {
        return new ProjectUser(id, userName, displayName, photoUrl);
    }

    public ProjectUser Update(string userName, string displayName, string photoUrl)
    {
        UserName = userName;
        DisplayName = displayName;
        PhotoUrl = photoUrl;
        LastModifiedTime = DateTime.UtcNow;
        return this;
    }

    public bool IsChanges(ProjectUser projectUser)
    {
        return UserName != projectUser.UserName
            || DisplayName != projectUser.DisplayName
            || PhotoUrl != projectUser.PhotoUrl;
    }
}
