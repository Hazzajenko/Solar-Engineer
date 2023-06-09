using Identity.Application.Data.UnitOfWork;
using Identity.SignalR.Handlers.AppUsers;
using Identity.SignalR.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUsers;

public class
    SearchForAppUserByUserNameHandler : IQueryHandler<SearchForAppUserByUserNameQuery,
        SearchForAppUserByUserNameResponse>
{
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<SearchForAppUserByUserNameHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public SearchForAppUserByUserNameHandler(IIdentityUnitOfWork unitOfWork,
        ILogger<SearchForAppUserByUserNameHandler> logger, IHubContext<UsersHub, IUsersHub> hubContext)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _hubContext = hubContext;
    }

    public async ValueTask<SearchForAppUserByUserNameResponse> Handle(SearchForAppUserByUserNameQuery query,
        CancellationToken cT)
    {
        var users = await _unitOfWork.AppUsersRepository.SearchForAppUserByUserNameAsync(query.Request.UserName);
        var response = new SearchForAppUserByUserNameResponse
        {
            AppUsers = users
        };

        await _hubContext.Clients.User(query.AuthUser.Id.ToString())
            .ReceiveSearchForAppUserByUserNameResponse(response);

        _logger.LogInformation("Found {Count} users for {UserName}", users.Count(), query.Request.UserName);

        return response;
    }
}