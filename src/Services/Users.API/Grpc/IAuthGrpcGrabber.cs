using Auth.API;

namespace Users.API.Grpc;

public interface IAuthGrpcGrabber
{
    Task<AppUserResponse> GetAppUserById(string appUserId);
}