using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.Update;

public sealed record UpdateMessagesByAppUserGroupChatQuery
(AppUser RemovedUser, int GroupChatId,
    IEnumerable<string>? UserNames = null) : IRequest<bool>;

public class
    UpdateMessagesByAppUserGroupChatHandler : IRequestHandler<UpdateMessagesByAppUserGroupChatQuery,
        bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;

    public UpdateMessagesByAppUserGroupChatHandler(IDataContext context,
        IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<bool>
        Handle(UpdateMessagesByAppUserGroupChatQuery request, CancellationToken cT)
    {
        var userMessages = await _context.GroupChatMessages
            .Where(x => x.SenderId == request.RemovedUser.Id && x.GroupChatId == request.GroupChatId)
            .ToListAsync(cT);

        foreach (var message in userMessages) message.SenderInGroup = false;
        await _context.SaveChangesAsync(cT);

        var userNames = request.UserNames ?? await _context.AppUserGroupChats
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.AppUser)
            .Select(x => x.AppUser.UserName!)
            .ToArrayAsync(cT);

        var messageUpdates = userMessages.Select(x => x.ToUpdateDto());

        await _hubContext.Clients.Users(userNames)
            .UpdateGroupChatMessages(messageUpdates, cT);

        return true;
    }
}