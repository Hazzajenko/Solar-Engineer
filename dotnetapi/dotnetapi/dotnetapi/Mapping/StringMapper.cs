using dotnetapi.Models.Dtos;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Mapping;

public static class StringMapper
{
    public static String ToEntity(this CreateStringRequest request)
    {
        return new String
        {
            Name = request.Name,
            CreatedAt = DateTime.Now,
            IsInParallel = false
        };
    }

    public static StringDto ToDto(this String request)
    {
        return new StringDto
        {
            Name = request.Name,
            ProjectId = request.ProjectId,
            IsInParallel = request.IsInParallel,
            CreatedAt = DateTime.Now
        };
    }
}