﻿using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.SignalR.Commands.Connections;
using Identity.SignalR.Hubs;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Connections;

public class OnConnectedHandler : ICommandHandler<OnConnectedCommand, bool>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnConnectedHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;

    public OnConnectedHandler(
        ILogger<OnConnectedHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        ConnectionsService connections,
        IIdentityUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(OnConnectedCommand command, CancellationToken cT)
    {
        var user = command.AuthUser;
        var userId = user.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any())
        {
            var connectionIdExists = userConnections.Contains(command.AuthUser.ConnectionId);
            if (connectionIdExists)
                return true;
            _connections.Add(userId, command.AuthUser.ConnectionId!);
            _logger.LogInformation(
                "User {AppUserId} - {AppUserUserName} connected with ConnectionId: {ConnectionId}",
                userId,
                user.UserName,
                command.AuthUser.ConnectionId
            );
            return true;
        }

        _connections.Add(userId, command.AuthUser.ConnectionId!);
        _logger.LogInformation(
            "User {AppUserId} - {AppUserUserName} connected with ConnectionId: {ConnectionId}",
            userId,
            user.UserName,
            command.AuthUser.ConnectionId
        );

        var newConnection = new ConnectionDto { AppUserId = userId.ToString() };

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOnline(newConnection);

        var allConnections = _connections.GetAllConnectedUserIds();

        var allConnectionsDtoList = allConnections
            .Select(x => new ConnectionDto { AppUserId = x.ToString() })
            .ToList();

        await _hubContext.Clients.User(userId.ToString()).GetOnlineUsers(allConnectionsDtoList);

        _logger.LogInformation("User {U} connected", userId);

        var appUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(userId);
        appUser.ThrowHubExceptionIfNull();
        appUser.LastActiveTime = DateTime.Now;
        await _unitOfWork.AppUsersRepository.UpdateAsync(appUser);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
