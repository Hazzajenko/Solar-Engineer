using Infrastructure.Repositories;
using Messages.Application.Data;
using Messages.Application.Mapping;
using Messages.Contracts.Data;
using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Messages.Application.Repositories.GroupChatServerMessages;

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