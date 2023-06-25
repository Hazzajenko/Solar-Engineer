using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Mediator;
using Messages.Contracts.Data;

namespace Messages.SignalR.Queries.Messages;

public sealed record GetLatestMessagesQuery(AuthUser AuthUser)
    : IQuery<IEnumerable<MessagePreviewDto>>,
        ISignalrRequest;
