using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.GroupChats.Handlers.SignalR;

public record UpdateSignalRGroupChatMessagesQuery
    (int GroupChatId, GroupChatServerMessage GroupChatServerMessage, IEnumerable<string> UserNames) : IRequest<bool>;

public class UpdateSignalRGroupChatMessagesHandler : IRequestHandler<UpdateSignalRGroupChatMessagesQuery, bool>
{
    private readonly IHubContext<MessagesHub> _hubContext;

    public UpdateSignalRGroupChatMessagesHandler(IHubContext<MessagesHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async ValueTask<bool>
        Handle(UpdateSignalRGroupChatMessagesQuery request, CancellationToken cT)
    {
        await _hubContext.Clients.Users(request.UserNames)
            .SendAsync("UpdateGroupChatMessages", request.GroupChatServerMessage.ToDto(), cT);

        return true;
    }
}