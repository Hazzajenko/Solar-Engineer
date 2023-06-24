using Infrastructure.Authentication;
using Infrastructure.SignalR.Common;
using Mediator;
using Messages.Contracts.Requests;
using Microsoft.AspNetCore.SignalR;

namespace Messages.SignalR.Commands.GroupChats;

public sealed record SendMessageToUserCommand(AuthUser AuthUser, SendMessageRequest MessageRequest)
    : IQuery<bool>,
        ISignalrRequest;
