using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Users.API.Data;
using Users.API.Hubs;
using Users.API.Mapping;

namespace Users.API.Handlers.Connections;

public sealed record OnDisconnectedAsyncCommand(HubCallerContext Context)
    : ICommand<bool>;

public class OnDisconnectedAsyncHandler
    : ICommandHandler<OnDisconnectedAsyncCommand, bool>
{
    private readonly IHubContext<ConnectionsHub, IConnectionsHub> _hubContext;
    private readonly ILogger<OnDisconnectedAsyncHandler> _logger;
    private readonly IConnectionsUnitOfWork _unitOfWork;

    public OnDisconnectedAsyncHandler(ILogger<OnDisconnectedAsyncHandler> logger, IConnectionsUnitOfWork unitOfWork,
        IHubContext<ConnectionsHub, IConnectionsHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        OnDisconnectedAsyncCommand request,
        CancellationToken cT
    )
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var userId = request.Context.User.GetUserId().ToGuid();
        var userConnection = await _unitOfWork.UserConnectionsRepository.GetByUserIdAsync(userId);

        if (userConnection is null) return true;

        await _unitOfWork.UserConnectionsRepository.DeleteAsync(userConnection.Id);
        await _unitOfWork.SaveChangesAsync();

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOffline(userConnection.ToDtoList());

        _logger.LogInformation("User {U} disconnected", userId);

        return true;
    }
}