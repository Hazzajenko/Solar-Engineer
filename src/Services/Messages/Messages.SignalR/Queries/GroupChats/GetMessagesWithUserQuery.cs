using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using Infrastructure.Authentication;
using Mediator;
using Messages.Contracts.Requests;
using Microsoft.AspNetCore.SignalR;

namespace Messages.SignalR.Queries.GroupChats;

public sealed record GetMessagesWithUserQuery(AuthUser AuthUser, GetMessagesWithUserRequest Request)
    : IQuery<bool>,
        ISignalrRequest;
