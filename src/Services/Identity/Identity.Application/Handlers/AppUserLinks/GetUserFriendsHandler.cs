using Identity.Application.Data.UnitOfWork;
using Identity.Contracts.Responses.Friends;
using Identity.Domain;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Identity.SignalR.Services;
using Infrastructure.Logging;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUserLinks;

public class GetUserFriendsHandler : ICommandHandler<GetUserFriendsCommand, GetUserFriendsResponse>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<GetUserFriendsHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public GetUserFriendsHandler(
        ILogger<GetUserFriendsHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext,
        ConnectionsService connections
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _connections = connections;
    }

    public async ValueTask<GetUserFriendsResponse> Handle(
        GetUserFriendsCommand command,
        CancellationToken cT
    )
    {
        var authUser = command.AuthUser;

        var userFriends = await _unitOfWork.AppUserLinksRepository.GetUserFriendsDtosAsync(
            authUser.Id
        );

        GetUserFriendsResponse response = new() { Friends = userFriends };

        response.DumpObjectJson();

        await _hubContext.Clients.User(authUser.Id.ToString()).GetUserFriends(response);

        _logger.LogInformation(
            "User {UserId}-{UserName} get online friends",
            authUser.Id.ToString(),
            authUser.UserName
        );

        return response;
    }
}
