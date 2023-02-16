using Infrastructure.Contracts.Data;
using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Infrastructure.Mapping;

public static class AppUserMapper
{
    public static AppUser ToEntity(this AppUserDto request)
    {
        return new AppUser
        {
            Id = Guid.Parse(request.Id),
            FirstName = request.FirstName,
            LastName = request.LastName,
            DisplayName = request.DisplayName,
            CreatedTime = request.CreatedTime,
            LastActiveTime = request.LastActiveTime,
            PhotoUrl = request.PhotoUrl
        };
    }

    public static AppUserDto ToDto(this AppUser request)
    {
        return new AppUserDto
        {
            Id = request.Id.ToString(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            DisplayName = request.DisplayName,
            PhotoUrl = request.PhotoUrl,
            CreatedTime = request.CreatedTime,
            LastActiveTime = request.LastActiveTime
        };
    }
}