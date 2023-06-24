using Infrastructure.Authentication;
using Infrastructure.SignalR.Common;
using Mediator;
namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetGroupChatMessagesQuery(AuthUser AuthUser, string GroupChatId)
    : IRequest<bool>,
        ISignalrRequest;
