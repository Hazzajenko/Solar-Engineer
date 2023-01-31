using dotnetapi.Data;
using dotnetapi.Exceptions;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.Delete;

public record DeleteAppUserGroupChatsQuery(IEnumerable<AppUser> AppUsers, int GroupChatId,
    IEnumerable<string>? UserNames = null) : IRequest<bool>;

public class DeleteAppUserGroupChatsHandler : IRequestHandler<DeleteAppUserGroupChatsQuery, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;

    public DeleteAppUserGroupChatsHandler(IDataContext context, IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<bool>
        Handle(DeleteAppUserGroupChatsQuery request, CancellationToken cT)
    {
        var userMessages = new List<GroupChatMessage>();
        var groupChatMemberIds = new List<int>();
        foreach (var appUser in request.AppUsers)
        {
            var appUserGroupChat = await _context.AppUserGroupChats
                .Where(x => x.AppUser.Id == appUser.Id && x.GroupChatId == request.GroupChatId)
                .SingleOrDefaultAsync(cT);

            if (appUserGroupChat is null)
                throw new NotFoundException(nameof(appUserGroupChat),
                    (appUser.Id, request.GroupChatId));

            groupChatMemberIds.Add(appUserGroupChat.Id);
            _context.AppUserGroupChats.Remove(appUserGroupChat);

            var messages = await _context.GroupChatMessages
                .Where(x => x.SenderId == appUser.Id && x.GroupChatId == request.GroupChatId)
                .ToListAsync(cT);
            userMessages.AddRange(messages);
        }

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


        await _hubContext.Clients.Users(userNames)
            .RemoveGroupChatMembers(groupChatMemberIds, cT);

        return true;
    }
}