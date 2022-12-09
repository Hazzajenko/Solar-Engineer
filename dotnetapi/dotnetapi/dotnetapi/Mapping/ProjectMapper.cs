using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class ProjectMapper {
    public static Project ToEntity(this CreateProjectRequest request) {
        return new Project {
            Name = request.Name,
            CreatedAt = DateTime.Now,
        };
    }

    public static ProjectDto ToDto(this Project request) {
        return new ProjectDto {
            Id = request.Id,
            Name = request.Name,
            CreatedAt = request.CreatedAt,
            CreatedBy = new AppUserDto {
                Username = request.CreatedBy.UserName,
                FirstName = request.CreatedBy.FirstName,
                LastName = request.CreatedBy.LastName
            },
        };
    }
}