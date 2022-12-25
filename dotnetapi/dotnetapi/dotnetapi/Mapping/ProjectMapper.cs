using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class ProjectMapper
{
    public static Project ToEntity(this CreateProjectRequest request, AppUser user)
    {
        return new Project
        {
            Name = request.Name,
            CreatedAt = DateTime.Now,
            CreatedBy = user
        };
    }

    public static Project ToEntity(this ProjectDto request)
    {
        return new Project
        {
            Name = request.Name,
            CreatedAt = request.CreatedAt
        };
    }

    public static ProjectDto ToDto(this Project request)
    {
        return new ProjectDto
        {
            Id = request.Id,
            Name = request.Name,
            CreatedAt = request.CreatedAt
            /*CreatedBy = new AppUserDto
            {
                Username = request.CreatedBy.UserName!,
                FirstName = request.CreatedBy.FirstName,
                LastActive = request.CreatedBy.LastActive
            }*/
        };
    }
}