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
// 

/*public static AppUser ToAppUser(this CreatedAppUser createdAppUser)
{
    return new AppUser
    {
        Id = createdAppUser.Id,
        FirstName = createdAppUser.FirstName,
        LastName = createdAppUser.LastName,
        Email = createdAppUser.FirstName,
        PhotoUrl = createdAppUser.PhotoUrl,
    };
}*/