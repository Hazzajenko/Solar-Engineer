using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Authentication;
using Mediator;
using Messages.Contracts.Requests;

namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetGroupChatMessagesQuery(
    AuthUser AuthUser,
    GetGroupChatMessagesRequest Request
) : IRequest<bool>, ISignalrRequest;
