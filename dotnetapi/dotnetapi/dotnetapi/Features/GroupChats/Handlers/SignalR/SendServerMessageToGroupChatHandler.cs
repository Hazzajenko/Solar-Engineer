using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.GroupChats.Handlers.SignalR;

public record SendServerMessageToGroupChatQuery
    (GroupChatServerMessage GroupChatServerMessage, IEnumerable<string> UserNames) : IRequest<bool>;

public class SendServerMessageToGroupChatHandler : IRequestHandler<SendServerMessageToGroupChatQuery, bool>
{
    private readonly IHubContext<MessagesHub> _hubContext;

    public SendServerMessageToGroupChatHandler(IHubContext<MessagesHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async ValueTask<bool>
        Handle(SendServerMessageToGroupChatQuery request, CancellationToken cT)
    {
        await _hubContext.Clients.Users(request.UserNames)
            .SendAsync("GetGroupChatServerMessages", request.GroupChatServerMessage.ToDto(), cT);

        return true;
    }
}