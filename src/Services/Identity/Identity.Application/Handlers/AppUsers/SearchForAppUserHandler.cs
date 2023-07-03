using ApplicationCore.Extensions;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Responses.Users;
using Identity.SignalR.Commands.AppUsers;
using Identity.SignalR.Hubs;
using Identity.SignalR.Queries;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUsers;

public class SearchForAppUserHandler
    : IQueryHandler<SearchForAppUserQuery, SearchForAppUserResponse>
{
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<SearchForAppUserHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly IConnectionsService _connectionsService;

    public SearchForAppUserHandler(
        IIdentityUnitOfWork unitOfWork,
        ILogger<SearchForAppUserHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IConnectionsService connectionsService
    )
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _hubContext = hubContext;
        _connectionsService = connectionsService;
    }

    public async ValueTask<SearchForAppUserResponse> Handle(
        SearchForAppUserQuery query,
        CancellationToken cT
    )
    {
        var authUser = query.AuthUser;
        var friendIds = await _unitOfWork.AppUserLinksRepository.GetUserFriendIdsAsync(authUser.Id);

        var searchQuery = query.Request.SearchQuery;

        var userSearchResults =
            await _unitOfWork.AppUsersRepository.SearchForUsersExcludingIdsAsync(
                searchQuery,
                friendIds
            );

        var searchResultIds = userSearchResults.Select(x => x.Id.ToGuid());

        var connections = _connectionsService.GetConnectionsByIds(searchResultIds);

        foreach (var webUser in userSearchResults)
        {
            webUser.IsOnline = connections.Any(c => c.AppUserId.ToString() == webUser.Id);
        }



        var response = new SearchForAppUserResponse { Users = userSearchResults };

        await _hubContext.Clients
            .User(query.AuthUser.Id.ToString())
            .ReceiveSearchResultsForAppUser(response);

        _logger.LogInformation(
            "{User} searched for {UserName}, {Count} results",
            authUser.ToAuthUserLog(),
            query.Request.SearchQuery,
            userSearchResults.Count()
        );

        return response;
    }
}
