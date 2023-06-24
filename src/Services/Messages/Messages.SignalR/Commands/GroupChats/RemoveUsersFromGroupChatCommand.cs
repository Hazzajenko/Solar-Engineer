using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Authentication;
using Mediator;
using Messages.Contracts.Requests;
using Microsoft.AspNetCore.SignalR;

namespace Messages.SignalR.Commands.GroupChats;

public sealed record RemoveUsersFromGroupChatCommand(
    AuthUser AuthUser,
    RemoveUsersFromGroupChatRequest RemoveRequest
) : IQuery<bool>, ISignalrRequest;
