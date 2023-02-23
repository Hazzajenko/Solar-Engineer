using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Data;
using Messages.API.Entities;
using Messages.API.Mapping;
using Microsoft.EntityFrameworkCore;

namespace Messages.API.Repositories.GroupChatMessages;

public sealed class GroupChatMessagesRepository : GenericRepository<MessagesContext, GroupChatMessage>,
    IGroupChatMessagesRepository
{
    public GroupChatMessagesRepository(MessagesContext context) : base(context)
    {
    }

    public async Task<IEnumerable<GroupChatMessageDto>> GetGroupChatMessagesAsync(Guid appUserId, Guid groupChatId)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto(appUserId))
            .ToListAsync();
    }
}