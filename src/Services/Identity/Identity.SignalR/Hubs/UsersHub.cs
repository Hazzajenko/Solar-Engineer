using Identity.Contracts.Data;
using Identity.SignalR.Handlers.AppUsers;
using Identity.SignalR.Handlers.Connections.OnConnected;
using Identity.SignalR.Handlers.Connections.OnDisconnected;
using Identity.SignalR.Handlers.Friends;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.SignalR.Hubs;

public class UsersHub : Hub<IUsersHub>
{
    private readonly ILogger<UsersHub> _logger;
    private readonly IMediator _mediator;

    public UsersHub(IMediator mediator, ILogger<UsersHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("OnConnectedAsync");
        await _mediator.Send(new OnConnectedCommand(Context.ToAuthUser()));
        await _mediator.Send(new GetOnlineFriendsQuery(Context.ToAuthUser()));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("OnDisconnectedAsync");
        await _mediator.Send(new OnDisconnectedCommand(Context.ToAuthUser()));

        await base.OnDisconnectedAsync(exception);
    }

    public async Task GetOnlineFriends()
    {
        await _mediator.Send(new GetOnlineFriendsQuery(Context.ToAuthUser()));
    }

    public async Task SearchForAppUserByUserName(string userName)
    {
        await _mediator.Send(new SearchForAppUserByUserNameQuery(Context.ToAuthUser(), userName));
    }
}
