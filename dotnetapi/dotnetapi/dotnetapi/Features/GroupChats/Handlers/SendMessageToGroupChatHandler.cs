using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Models.Entities;
using Mediator;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record SendMessageToGroupChatQuery
    (GroupChatMessage Message, AppUser AppUser) : IRequest<GroupChatMessage>;

public class
    SendMessageToGroupChatHandler : IRequestHandler<SendMessageToGroupChatQuery, GroupChatMessage>
{
    private readonly IDataContext _context;

    public SendMessageToGroupChatHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<GroupChatMessage>
        Handle(SendMessageToGroupChatQuery request, CancellationToken cT)
    {
        await _context.GroupChatMessages.AddAsync(request.Message, cT);
        await _context.SaveChangesAsync(cT);

        return request.Message;
    }
}