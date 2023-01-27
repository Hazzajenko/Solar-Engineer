using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class AppUserMapper
{
    public static AppUserDto ToDto(this AppUser request)
    {
        return new AppUserDto
        {
            UserName = request.UserName!,
            FirstName = request.FirstName,
            LastName = request.LastName,
            LastActive = request.LastActive,
            Created = request.Created,
            PhotoUrl = request.PhotoUrl
        };
    }

    public static AppUser ToEntityV3(this AuthRequest request)
    {
        return new AppUser
        {
            Email = "",
            UserName = request.UserName,
            FirstName = "",
            LastName = "",
            PhotoUrl = ""
        };
    }

    public static AppUserProject ToAppUserProject(this CreateProjectRequest request, AppUser user)
    {
        return new AppUserProject
        {
            AppUserId = user.Id,
            AppUser = user,
            JoinedAt = DateTime.Now,
            Role = "Admin",
            CanCreate = true,
            CanDelete = true,
            CanInvite = true,
            CanKick = true,
            Project = request.ToEntity(user)
        };
    }
}