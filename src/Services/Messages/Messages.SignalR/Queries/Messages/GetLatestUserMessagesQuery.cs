using System.Security.Claims;
using Infrastructure.Authentication;
using Infrastructure.SignalR.Common;
using Mediator;
using Messages.Contracts.Data;

namespace Messages.SignalR.Queries.Messages;

public sealed record GetLatestUserMessagesQuery(AuthUser AuthUser)
    : IQuery<IEnumerable<LatestUserMessageDto>>,
        ISignalrRequest;
