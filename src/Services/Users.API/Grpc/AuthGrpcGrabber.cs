// using Auth.API;

// using Auth.API;

// using Auth.API;

// using Auth.API;

// using Auth.API;

using Auth.API;

namespace Users.API.Grpc;

public class AuthGrpcGrabber : IAuthGrpcGrabber
{
    private readonly AuthGrpc.AuthGrpcClient _authGrpcClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthGrpcGrabber> _logger;

    public AuthGrpcGrabber(IConfiguration configuration, AuthGrpc.AuthGrpcClient authGrpcClient,
        ILogger<AuthGrpcGrabber> logger)
    {
        _configuration = configuration;
        _authGrpcClient = authGrpcClient;
        _logger = logger;
    }

    public async Task<AppUserResponse> GetAppUserById(string appUserId)
    {
        _logger.LogDebug("Grpc GetAppUserById {Id}", appUserId);
        var response = await _authGrpcClient.GetAppUserByIdAsync(new AppUserRequest { Id = appUserId });
        return response;
        /*_logger.LogDebug("grpc response {@response}", response);
        var channel = GrpcChannel.ForAddress("https://localhost:6005");
        var client = new AuthGrpc.AuthGrpcClient(channel);

        try
        {
            var appUserResponse = await client.GetAppUserByIdAsync(new AppUserRequest { Id = appUserId });
            if (appUserResponse is null) throw new ArgumentNullException(nameof(appUserResponse));

            return appUserResponse;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"--> Couldnot call GRPC Server {ex.Message}");
            throw new Exception($"--> Couldnot call GRPC Server {ex.Message}");
        }*/
    }
}