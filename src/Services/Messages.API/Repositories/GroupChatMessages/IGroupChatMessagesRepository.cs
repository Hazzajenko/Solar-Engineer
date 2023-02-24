using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Entities;

namespace Messages.API.Repositories.GroupChatMessages;

public interface IGroupChatMessagesRepository : IGenericRepository<GroupChatMessage>
{
    Task<IEnumerable<GroupChatCombinedMessageDto>> GetGroupChatMessagesAsync(Guid appUserId, Guid groupChatId);
}