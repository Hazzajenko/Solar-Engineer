using dotnetapi.Data;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetGroupChatMessagesQuery(AppUser AppUser, IEnumerable<int> GroupChatIds) : IRequest<IEnumerable<LastGroupChatMessageDto>>;

public class
    GetGroupChatMessagesHandler : IRequestHandler<GetGroupChatMessagesQuery, IEnumerable<LastGroupChatMessageDto>>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatMessagesHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<IEnumerable<LastGroupChatMessageDto>>
        Handle(GetGroupChatMessagesQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        var groupChatMessages = await db.GroupChatMessages
            .Where(x => request.GroupChatIds.Contains(x.GroupChatId))
            .Include(x => x.Sender)
            .Include(x => x.MessageReadTimes)
            .GroupBy(x => x.GroupChatId)
            .Select(x => new LastGroupChatMessageDto
            {
                GroupChatId = x.Key,
                Message = x.OrderBy(o => o.MessageSentTime)
                    .Select(y => y.ToDto())
                    .SingleOrDefault()
            })
            .ToListAsync(cT);

        /*var groupChatMessagesResult = new List<GroupChatMessageDto>();
        foreach (var appUserGroupChatId in appUserGroupChatIds)
        {
            var groupChatMessage = await db.GroupChatMessages
                .Where(x => x.GroupChatId == appUserGroupChatId)
                .Include(x => x.Sender)
                .Include(x => x.MessageReadTimes)
                .OrderBy(x => x.MessageSentTime)
                .Select(x => x.ToDto())
                .Take(1)
                .SingleOrDefaultAsync(cT);
            if (groupChatMessage is null) continue;
            groupChatMessagesResult.Add(groupChatMessage);
        }*/


        return groupChatMessages;

    }
}