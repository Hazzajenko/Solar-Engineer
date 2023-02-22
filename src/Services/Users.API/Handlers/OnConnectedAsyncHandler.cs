using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Users.API.Contracts.Requests;
using Users.API.Data;
using Users.API.Entities;

namespace Users.API.Handlers;

public sealed record OnConnectedAsyncCommand(HubCallerContext Context)
    : ICommand<bool>;

public class OnConnectedAsyncHandler
    : ICommandHandler<OnConnectedAsyncCommand, bool>
{
    private readonly ILogger<OnConnectedAsyncHandler> _logger;
    private readonly IConnectionsUnitOfWork _unitOfWork;

    public OnConnectedAsyncHandler(ILogger<OnConnectedAsyncHandler> logger, IConnectionsUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        OnConnectedAsyncCommand request,
        CancellationToken cT
    )
    {
        ArgumentNullException.ThrowIfNull(request.Context.User);
        var userId = request.Context.User.GetUserId().ToGuid();
        var userConnection = await _unitOfWork.UserConnectionsRepository.GetByUserIdAsync(userId);

        if (userConnection is not null)
        {
            
            userConnection.Connections.Add(new WebConnection
            {
                UserId = userId,
                ConnectionId = request.Context.ConnectionId
            });
            return true;
        }

        userConnection = new UserConnection
        {
            UserId = userId,
            Connections = new List<WebConnection>
            {
                new()
                {
                    UserId = userId,
                    ConnectionId = request.Context.ConnectionId,
                }
            }
        };

        await _unitOfWork.UserConnectionsRepository.AddAsync(userConnection);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}