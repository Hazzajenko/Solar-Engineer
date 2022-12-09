using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class AppUserMapper {
    public static AppUserDto ToDto(this AppUser request) {
        return new AppUserDto {
            Username = request.UserName!,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
    }

    public static AppUser ToDomain(this SignupRequest request) {
        return new AppUser {
            Email = request.Email,
            UserName = request.Username,
            FirstName = request.FirstName,
            LastName = request.LastName
        };
    }

    public static AppUserProject ToAppUserProject(this AppUser request) {
        return new AppUserProject {
            AppUserId = request.Id,
            AppUser = request,
            JoinedAt = DateTime.Now,
            Role = "Admin",
            CanCreate = true,
            CanDelete = true,
            CanInvite = true,
            CanKick = true
        };
    }
}