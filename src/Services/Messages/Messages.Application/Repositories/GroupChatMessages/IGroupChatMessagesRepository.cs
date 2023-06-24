using Infrastructure.Repositories;
using Messages.Contracts.Data;
using Messages.Domain.Entities;

namespace Messages.Application.Repositories.GroupChatMessages;

public interface IGroupChatMessagesRepository : IGenericRepository<GroupChatMessage>
{
    Task<IEnumerable<GroupChatCombinedMessageDto>> GetGroupChatMessagesAsync(Guid appUserId, Guid groupChatId);
}