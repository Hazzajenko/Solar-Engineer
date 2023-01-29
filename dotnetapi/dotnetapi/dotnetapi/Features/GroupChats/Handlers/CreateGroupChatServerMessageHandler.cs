using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using Mediator;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record CreateGroupChatServerMessageQuery
    (GroupChatServerMessage GroupChatServerMessage) : IRequest<GroupChatServerMessage>;

public class
    CreateGroupChatServerMessageHandler : IRequestHandler<CreateGroupChatServerMessageQuery, GroupChatServerMessage>
{
    private readonly IDataContext _context;

    public CreateGroupChatServerMessageHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<GroupChatServerMessage>
        Handle(CreateGroupChatServerMessageQuery request, CancellationToken cT)
    {
        await _context.GroupChatServerMessages.AddAsync(request.GroupChatServerMessage, cT);
        await _context.SaveChangesAsync(cT);
        return request.GroupChatServerMessage;
    }
}