using Projects.Domain.Contracts.Data;
using Projects.Domain.Contracts.Requests.Projects;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

public static class ProjectsMapping
{
    public static Project ToDomain(this CreateProjectRequest request, Guid appUserId)
    {
        return new Project
        {
            Name = request.Name,
            CreatedById = appUserId,
            AppUserProjects = new List<AppUserProject>
            {
                new()
                {
                    AppUserId = appUserId,
                    Role = "Admin",
                    CanCreate = true,
                    CanDelete = true,
                    CanInvite = true,
                    CanKick = true
                }
            }
        };
    }

    public static ProjectDto ToDto(this AppUserProject request)
    {
        return new ProjectDto
        {
            Id = request.Project.Id.ToString(),
            Name = request.Project.Name,
            CreatedById = request.Project.CreatedById.ToString(),
            CreatedTime = request.Project.CreatedTime
        };
    }

    public static ProjectDto ToDto(this Project request)
    {
        return new ProjectDto
        {
            Id = request.Id.ToString(),
            Name = request.Name,
            CreatedById = request.CreatedById.ToString(),
            CreatedTime = request.CreatedTime,
            LastModifiedTime = request.LastModifiedTime,
            MemberIds = request.AppUserProjects.Select(x => x.AppUserId.ToString())
        };
    }
}