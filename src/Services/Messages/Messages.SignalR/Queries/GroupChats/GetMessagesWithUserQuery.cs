using Infrastructure.Authentication;
using Infrastructure.SignalR.Common;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetMessagesWithUserQuery(AuthUser AuthUser, string RecipientId)
    : IQuery<bool>,
        ISignalrRequest;
