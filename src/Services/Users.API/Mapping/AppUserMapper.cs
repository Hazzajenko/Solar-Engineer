using Auth.API;
using Users.API.Entities;
// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Mapping;

public static class AppUserMapper
{
    public static User ToUser(this AppUserResponse grpcRequest)
    {
        return new User
        {
            Id = Guid.Parse(grpcRequest.Id),
            // CreatedTime = grpcRequest.CreatedTime,
            // LastModifiedTime = grpcRequest.LastModifiedTime,
            FirstName = grpcRequest.FirstName,
            LastName = grpcRequest.LastName,
            DisplayName = grpcRequest.FirstName,
            PhotoUrl = grpcRequest.PhotoUrl
            // LastActiveTime = grpcRequest.LastActiveTime,
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