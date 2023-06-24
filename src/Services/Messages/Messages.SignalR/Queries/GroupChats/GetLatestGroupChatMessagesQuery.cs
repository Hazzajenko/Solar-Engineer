using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Authentication;
using Mediator;
using Messages.Contracts.Data;

namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetLatestGroupChatMessagesQuery(AuthUser AuthUser)
    : IQuery<IEnumerable<GroupChatDto>>,
        ISignalrRequest;
