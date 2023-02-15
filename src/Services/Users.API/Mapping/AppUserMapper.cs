using Auth.API;
using Infrastructure.Entities.Identity;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Mapping;

public static class AppUserMapper
{
    public static AppUser ToAppUser(this AppUserResponse grpcRequest)
    {
        return new AppUser
        {
            Id = Guid.Parse(grpcRequest.Id),
            FirstName = grpcRequest.FirstName,
            LastName = grpcRequest.LastName,
            Email = grpcRequest.FirstName,
            PhotoUrl = grpcRequest.PhotoUrl
        };
    }
}