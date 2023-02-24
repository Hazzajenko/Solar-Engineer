using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests;
using Projects.API.Entities;

namespace Projects.API.Mapping;

public static class ProjectsMapping
{
    public static Project ToDomain(this CreateProjectRequest request, Guid appUserId)
    {
        return new Project
        {
            Name = request.Name,
            CreatedById = appUserId
        };
    }

    public static ProjectDto ToDto(this AppUserProject request)
    {
        return new ProjectDto
        {
            Id = request.Project.Id.ToString(),
            Name = request.Project.Name,
            CreatedById = request.Project.CreatedById.ToString(),
            CreatedAt = request.Project.CreatedTime
        };
    }
}