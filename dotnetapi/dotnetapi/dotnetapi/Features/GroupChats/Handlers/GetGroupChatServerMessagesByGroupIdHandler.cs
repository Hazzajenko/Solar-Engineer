using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public record GetGroupChatServerMessagesByGroupIdQuery
    (int GroupChatId) : IRequest<IEnumerable<GroupChatServerMessageDto>>;

public class
    GetGroupChatServerMessagesByGroupIdHandler : IRequestHandler<GetGroupChatServerMessagesByGroupIdQuery,
        IEnumerable<GroupChatServerMessageDto>>
{
    private readonly IDataContext _context;

    public GetGroupChatServerMessagesByGroupIdHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<GroupChatServerMessageDto>>
        Handle(GetGroupChatServerMessagesByGroupIdQuery request, CancellationToken cT)
    {
        return await _context.GroupChatServerMessages
            .Where(x => x.GroupChatId == request.GroupChatId)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto())
            .ToListAsync(cT);
    }
}