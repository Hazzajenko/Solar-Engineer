using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public record CreateGroupChatServerMessageQuery
(GroupChatServerMessage GroupChatServerMessage,
    IEnumerable<string>? UserNames = null) : IRequest<GroupChatServerMessage>;

public class
    CreateGroupChatServerMessageHandler : IRequestHandler<CreateGroupChatServerMessageQuery, GroupChatServerMessage>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;

    public CreateGroupChatServerMessageHandler(IDataContext context, IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<GroupChatServerMessage>
        Handle(CreateGroupChatServerMessageQuery request, CancellationToken cT)
    {
        await _context.GroupChatServerMessages.AddAsync(request.GroupChatServerMessage, cT);
        await _context.SaveChangesAsync(cT);

        var userNames = request.UserNames ?? await _context.AppUserGroupChats
            .Where(x => x.GroupChatId == request.GroupChatServerMessage.GroupChatId)
            .Include(x => x.AppUser)
            .Select(x => x.AppUser.UserName!)
            .ToArrayAsync(cT);

        var serverMessages = new List<GroupChatServerMessageDto> { request.GroupChatServerMessage.ToDto() };

        await _hubContext.Clients.Users(userNames)
            .GetGroupChatServerMessages(serverMessages,
                cT);

        return request.GroupChatServerMessage;
    }
}