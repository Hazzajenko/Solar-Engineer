using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Data;
using Messages.API.Entities;
using Messages.API.Mapping;
using Microsoft.EntityFrameworkCore;

namespace Messages.API.Repositories.GroupChatServerMessages;

public sealed class GroupChatServerMessagesRepository : GenericRepository<MessagesContext, GroupChatServerMessage>,
    IGroupChatServerMessagesRepository
{
    public GroupChatServerMessagesRepository(MessagesContext context) : base(context)
    {
    }

    public async Task<IEnumerable<GroupChatServerMessageDto>> GetGroupChatServerMessagesAsync(Guid groupChatId)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto())
            .ToListAsync();
    }
}