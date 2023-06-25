using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Mediator;
using Messages.Contracts.Data;

namespace Messages.SignalR.Queries.UserMessages;

public sealed record GetLatestUserMessagesQuery(AuthUser AuthUser)
    : IQuery<IEnumerable<LatestUserMessageDto>>,
        ISignalrRequest;
