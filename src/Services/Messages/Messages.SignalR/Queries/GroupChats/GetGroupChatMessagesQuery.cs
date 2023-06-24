using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Authentication;
using Mediator;
namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetGroupChatMessagesQuery(AuthUser AuthUser, string GroupChatId)
    : IRequest<bool>,
        ISignalrRequest;
