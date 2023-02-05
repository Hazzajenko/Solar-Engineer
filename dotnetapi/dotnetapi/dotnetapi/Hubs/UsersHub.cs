using dotnetapi.Features.Users.Data;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Hubs;

public interface IUsersHub
{
    Task GetAppUserLinks(IEnumerable<AppUserLinkDto> appUserLinks);
}

public class UsersHub : Hub<IUsersHub>
{
    private readonly ILogger<UsersHub> _logger;

    public UsersHub(ILogger<UsersHub> logger)
    {
        _logger = logger;
    }
}