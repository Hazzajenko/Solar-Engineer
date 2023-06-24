using System.Security.Claims;
using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Authentication;
using Mediator;
using Messages.Contracts.Data;

namespace Messages.SignalR.Queries.Messages;

public sealed record GetLatestUserMessagesQuery(AuthUser AuthUser)
    : IQuery<IEnumerable<LatestUserMessageDto>>,
        ISignalrRequest;
