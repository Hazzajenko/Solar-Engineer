using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Entities;

namespace Messages.API.Repositories.GroupChatServerMessages;

public interface IGroupChatServerMessagesRepository : IGenericRepository<GroupChatServerMessage>
{
    Task<IEnumerable<GroupChatServerMessageDto>> GetGroupChatServerMessagesAsync(Guid groupChatId);
}