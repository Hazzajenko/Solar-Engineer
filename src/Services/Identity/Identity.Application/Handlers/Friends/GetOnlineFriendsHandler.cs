using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Friends;
using Identity.Domain;
using Identity.SignalR.Commands.Friends;
using Identity.SignalR.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Friends;

public class GetOnlineFriendsHandler : IQueryHandler<GetOnlineFriendsQuery, GetOnlineFriendsResponse>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<GetOnlineFriendsHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public GetOnlineFriendsHandler(
        ILogger<GetOnlineFriendsHandler> logger,
        IIdentityUnitOfWork unitOfWork,
        IHubContext<UsersHub, IUsersHub> hubContext, ConnectionsService connections)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _connections = connections;
    }

    public async ValueTask<GetOnlineFriendsResponse> Handle(GetOnlineFriendsQuery request, CancellationToken cT)
    {
        var authUser = request.AuthUser;

        var userFriendIds = await _unitOfWork.AppUserLinksRepository.GetUserFriendIdsAsync(authUser.Id);
        if (!userFriendIds.Any())
        {
            var noFriendsResponse = new GetOnlineFriendsResponse
            {
                OnlineFriends = new List<AppUserConnectionDto>()
            };
            await _hubContext.Clients.User(authUser.Id.ToString()).GetOnlineFriends(noFriendsResponse);
            return noFriendsResponse;
        }


        var onlineFriendConnections = _connections.GetUserConnectionsByIds(userFriendIds);
        var response = new GetOnlineFriendsResponse
        {
            OnlineFriends = new List<AppUserConnectionDto>(onlineFriendConnections)
        };

        await _hubContext.Clients.User(authUser.Id.ToString()).GetOnlineFriends(response);

        _logger.LogInformation(
            "User {UserId}-{UserName} get online friends",
            authUser.Id.ToString(),
            authUser.UserName
        );

        return response;
    }
}