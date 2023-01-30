using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.SignalR;

public sealed record SendSignalRMessageToGroupChatQuery
    (int GroupChatId, GroupChatServerMessage GroupChatServerMessage) : IRequest<bool>;

public class SendSignalRMessageToGroupChatHandler : IRequestHandler<SendSignalRMessageToGroupChatQuery, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub> _hubContext;

    public SendSignalRMessageToGroupChatHandler(IDataContext context, IHubContext<MessagesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<bool>
        Handle(SendSignalRMessageToGroupChatQuery request, CancellationToken cT)
    {
        var groupChatMembers = await _context.AppUserGroupChats
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.AppUser)
            .Select(x => x.AppUser.UserName!)
            .ToArrayAsync(cT);
        if (groupChatMembers.Any() is false) return false;

        await _hubContext.Clients.Users(groupChatMembers)
            .SendAsync("GetServerMessages", request.GroupChatServerMessage, cT);

        return true;
    }
}