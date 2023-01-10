using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Models.Dtos.Projects;
using Path = dotnetapi.Models.Entities.Path;

namespace dotnetapi.Mapping;

public static class PathMapper
{
    public static Path ToEntity(this CreatePathRequest request)
    {
        return new Path
        {
            Id = request.Id,
            Link = request.Link,
            Count = request.Count,
            Color = request.Color
        };
    }

    public static Path ToEntity(this PathDto request)
    {
        return new Path
        {
            Color = request.Color
        };
    }

    public static PathDto ToDto(this Path request)
    {
        return new PathDto
        {
            Id = request.Id,
            ProjectId = request.Project.Id,
            Color = request.Color,
            Type = EntityTypeDto.Path,
            Count = request.Count,
            Link = request.Link,
            PanelId = request.Panel.Id,
            StringId = request.String.Id
            // CreatedAt = DateTime.Now
        };
    }
}