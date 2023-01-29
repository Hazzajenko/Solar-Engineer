using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Models.Entities;
using Mediator;

namespace dotnetapi.Features.GroupChats.Handlers;

public record GetGroupChatMessagesWithServerQuery
    (AppUser AppUser, IEnumerable<int> GroupChatIds) : IRequest<GetGroupChatServerMessagesResponse>;

public class GetGroupChatMessagesWithServerResponse
{
    public IEnumerable<GroupChatServerMessageDto> ServerMessages { get; set; } = new List<GroupChatServerMessageDto>();
}

public class
    GetGroupChatMessagesWithServerHandler : IRequestHandler<GetGroupChatServerMessagesQuery,
        GetGroupChatServerMessagesResponse>
{
    private readonly IDataContext _context;

    public GetGroupChatMessagesWithServerHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<GetGroupChatServerMessagesResponse>
        Handle(GetGroupChatServerMessagesQuery request, CancellationToken cT)
    {
        /*var messages = await _context.GroupChatMessages
            .Where(x => request.GroupChatIds.Contains(x.GroupChatId))
            .Include(x => x.Sender)
            .Include(x => x.MessageReadTimes)
            .ThenInclude(x => x.AppUser)
            .GroupBy(x => x.GroupChatId)
            .Select(x => x.OrderBy(o => o.MessageSentTime)
                .Select(y => y.ToDto(request.AppUser))
                .Last())
            .SingleOrDefaultAsync(cT);


        var result = await _context.GroupChatServerMessages
            .Where(x => request.GroupChatIds.Contains(x.GroupChatId))
            .GroupBy(x => x.GroupChatId)
            .Select(x => x.OrderBy(o => o.MessageSentTime)
                .Select(y => y.ToDto())
                .Last())
            .SingleOrDefaultAsync(cT);

        // var join = messages.AddRange(result);

        return new GetGroupChatServerMessagesResponse
        {
            ServerMessages = result
        };*/
        return new GetGroupChatServerMessagesResponse
        {
            ServerMessages = new List<GroupChatServerMessageDto>()
        };
    }
}