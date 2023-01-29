using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public record GetGroupChatServerMessagesQuery
    (AppUser AppUser, IEnumerable<int> GroupChatIds) : IRequest<GetGroupChatServerMessagesResponse>;

public class GetGroupChatServerMessagesResponse
{
    public IEnumerable<GroupChatServerMessageDto> ServerMessages { get; set; } = new List<GroupChatServerMessageDto>();
}

public class
    GetGroupChatServerMessagesHandler : IRequestHandler<GetGroupChatServerMessagesQuery,
        GetGroupChatServerMessagesResponse>
{
    private readonly IDataContext _context;

    public GetGroupChatServerMessagesHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<GetGroupChatServerMessagesResponse>
        Handle(GetGroupChatServerMessagesQuery request, CancellationToken cT)
    {
        var result = await _context.GroupChatServerMessages
            .Where(x => request.GroupChatIds.Contains(x.GroupChatId))
            .GroupBy(x => x.GroupChatId)
            .Select(x => x.OrderBy(o => o.MessageSentTime)
                .Select(y => y.ToDto())
                .Last())
            .ToListAsync(cT);

        return new GetGroupChatServerMessagesResponse
        {
            ServerMessages = result
        };
    }
}