using Infrastructure.Entities.Identity;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Grpc;

public interface IAuthGrpcService
{
    Task<AppUser> GetAppUserById(string appUserId);
}