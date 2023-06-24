using Infrastructure.Authentication;
using Infrastructure.SignalR.Common;
using Mediator;
using Messages.Contracts.Data;

namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetLatestGroupChatMessagesQuery(AuthUser AuthUser)
    : IQuery<IEnumerable<GroupChatDto>>,
        ISignalrRequest;
