using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Mapping;

public static class StringMapper
{
    /*public static String ToEntity(this UpdateStringRequest request)
    {
        return new String
        {
            Id = request.Id,
            Name = request.Name,
            CreatedAt = DateTime.Now,
            IsInParallel = false,
        };
    }*/

    public static String ToEntity(this CreateStringRequest request, AppUser user)
    {
        return new String
        {
            Id = request.Id,
            Name = request.Name,
            CreatedAt = DateTime.Now,
            Parallel = false,
            CreatedBy = user,
            Color = request.Color
        };
    }

    public static String ToEntity(this StringDto request)
    {
        return new String
        {
            Name = request.Name,
            CreatedAt = DateTime.Now,
            Parallel = false,
            Color = request.Color
        };
    }

    public static StringDto ToDto(this String request)
    {
        return new StringDto
        {
            Id = request.Id,
            ProjectId = request.Project.Id,
            Name = request.Name,
            Parallel = request.Parallel,
            Color = request.Color,
            Type = EntityTypeDto.String
            // CreatedAt = DateTime.Now
        };
    }
}