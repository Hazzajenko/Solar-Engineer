// using Infrastructure.Entities.Identity;
// using AppUser = Users.API.Entities.AppUser;

using Users.API.Entities;

namespace Users.API.Grpc;

public interface IAuthGrpcService
{
    Task<User> GetAppUserById(string appUserId);
}