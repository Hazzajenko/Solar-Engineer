using Auth.API.Entities;
using Auth.API.Repositories;
using Grpc.Core;

namespace Auth.API.Services;

public class AppUsersGrpcService : AuthGrpc.AuthGrpcBase
{
    private readonly IAppUserRepository _appUserRepository;

    public AppUsersGrpcService(IAppUserRepository appUserRepository)
    {
        _appUserRepository = appUserRepository;
    }

    public override async Task<AppUserResponse> GetAppUserById(AppUserRequest request, ServerCallContext context)
    {
        var appUser = await _appUserRepository.GetByIdAsync(Guid.Parse(request.Id));
        if (appUser is null) throw new ArgumentNullException(nameof(AppUser));

        var response = new AppUserResponse
        {
            Id = appUser.Id.ToString(),
            FirstName = appUser.FirstName,
            LastName = appUser.LastName,
            PhotoUrl = appUser.PhotoUrl
        };

        return response;
    }
}