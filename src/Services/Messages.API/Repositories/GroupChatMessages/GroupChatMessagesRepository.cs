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

    public async Task<IEnumerable<GroupChatMessageDto>> GetGroupChatMessagesAsync(User appUser, Guid groupChatId)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .Include(x => x.Sender)
            .Include(x => x.MessageReadTimes)
            .ThenInclude(x => x.User)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto(appUser))
            .ToListAsync();
    }
}