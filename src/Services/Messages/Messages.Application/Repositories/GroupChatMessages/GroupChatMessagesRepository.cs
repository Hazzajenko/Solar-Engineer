using Infrastructure.Repositories;
using Messages.Application.Data;
using Messages.Application.Mapping;
using Messages.Contracts.Data;
using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messages.Application.Repositories.GroupChatMessages;

public sealed class GroupChatMessagesRepository : GenericRepository<MessagesContext, GroupChatMessage>,
    IGroupChatMessagesRepository
{
    public GroupChatMessagesRepository(MessagesContext context) : base(context)
    {
    }

    public async Task<IEnumerable<GroupChatCombinedMessageDto>> GetGroupChatMessagesAsync(Guid appUserId,
        Guid groupChatId)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToCombinedDto(appUserId))
            .ToListAsync();
    }
}