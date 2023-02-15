using Auth.API;
using Infrastructure.Entities.Identity;
using Users.API.Mapping;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Grpc;

public class AuthGrpcService : IAuthGrpcService
{
    private readonly AuthGrpc.AuthGrpcClient _authGrpcClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthGrpcService> _logger;

    public AuthGrpcService(IConfiguration configuration, AuthGrpc.AuthGrpcClient authGrpcClient,
        ILogger<AuthGrpcService> logger)
    {
        _configuration = configuration;
        _authGrpcClient = authGrpcClient;
        _logger = logger;
    }

    public async Task<AppUser> GetAppUserById(string appUserId)
    {
        _logger.LogDebug("Grpc GetAppUserById {Id}", appUserId);
        var response = await _authGrpcClient.GetAppUserByIdAsync(new AppUserRequest { Id = appUserId });
        if (response is null)
            throw new ArgumentNullException(nameof(response));
        return response.ToAppUser();
    }
}