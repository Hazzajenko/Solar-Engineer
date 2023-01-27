using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class AppUserProjectMapper
{
    /*public static AppUserProject ToAppUserProject(this CreateProjectRequest request) {
        return new AppUserProject {
            AppUser = request.AppUser,
            Project = request.ProjectRequest.ToEntity(),
            JoinedAt = DateTime.Now,
            Role = "Admin",
            CanCreate = true,
            CanDelete = true,
            CanInvite = true,
            CanKick = true
        };
    }*/

    public static AppUserProjectDto ToDto(this AppUserProject request)
    {
        return new AppUserProjectDto
        {
            AppUser = new AppUserDto
            {
                UserName = request.AppUser.UserName!,
                FirstName = request.AppUser.FirstName,
                LastActive = request.AppUser.LastActive
            },
            Project = request.Project.ToDto(),
            JoinedAt = DateTime.Now,
            Role = request.Role,
            CanCreate = request.CanCreate,
            CanDelete = request.CanDelete,
            CanInvite = request.CanInvite,
            CanKick = request.CanKick
        };
    }
}