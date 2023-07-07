using ApplicationCore.Entities;
using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Friends;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Friends;

public class GetUserFriendsHandler : ICommandHandler<GetUserFriendsCommand, GetUserFriendsResponse>
{
    private readonly IConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<GetUserFriendsHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public GetUserFriendsHandler(
        ILogger<GetUserFriendsHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IConnectionsService connections
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
        AuthUser authUser = command.AuthUser;

        var userFriends = await _unitOfWork.AppUserLinksRepository.GetUserFriendsAsWebUserDtoAsync(
            authUser.Id
        );

        if (!userFriends.Any())
        {
            var noFriendsResponse = new GetUserFriendsResponse { Friends = new List<WebUserDto>() };
            await _hubContext.Clients
                .User(authUser.Id.ToString())
                .GetUserFriends(noFriendsResponse);
            return noFriendsResponse;
        }

        var userFriendIds = userFriends.Select(f => f.Id.ToGuid()).ToList();
        var onlineFriendConnections = _connections.GetUserConnectionsByIds(userFriendIds);

        foreach (WebUserDto friend in userFriends)
        {
            friend.IsOnline = onlineFriendConnections.Any(c => c.AppUserId.ToString() == friend.Id);
        }

        GetUserFriendsResponse response = new() { Friends = userFriends };

        await _hubContext.Clients.User(authUser.Id.ToString()).GetUserFriends(response);

        _logger.LogInformation(
            "User {UserName}: Get {FriendsCount} friends, {OnlineFriendsCount} online",
            authUser.UserName,
            response.Friends.Count(),
            response.Friends.Count(f => f.IsOnline)
        );

        return response;
    }
}
