using Infrastructure.Repositories;
using Messages.Contracts.Data;
using Messages.Domain.Entities;

namespace Messages.Application.Repositories.GroupChatServerMessages;

public interface IGroupChatServerMessagesRepository : IGenericRepository<GroupChatServerMessage>
{
    Task<IEnumerable<GroupChatServerMessageDto>> GetGroupChatServerMessagesAsync(Guid groupChatId);
}