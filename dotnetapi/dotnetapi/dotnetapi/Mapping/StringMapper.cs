using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos;
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
            IsInParallel = false,
            CreatedBy = user
        };
    }

    public static String ToEntity(this StringDto request)
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
            Id = request.Id,
            ProjectId = request.Project.Id,
            Name = request.Name,
            IsInParallel = request.IsInParallel
            // CreatedAt = DateTime.Now
        };
    }
}
