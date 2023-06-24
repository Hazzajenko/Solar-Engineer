using Infrastructure.Authentication;
using Infrastructure.SignalR.Common;
using Mediator;
using Messages.Contracts.Requests;
using Microsoft.AspNetCore.SignalR;

namespace Messages.SignalR.Commands.GroupChats;

public sealed record SendMessageToGroupChatCommand(
    AuthUser AuthUser,
    SendGroupChatMessageRequest GroupChatMessageRequest
) : IQuery<bool>, ISignalrRequest;
