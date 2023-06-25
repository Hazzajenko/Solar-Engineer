using Infrastructure.Repositories;
using Messages.Contracts.Data;
using Messages.Domain.Entities;

namespace Messages.Application.Repositories.AppUserGroupChats;

public interface IAppUserGroupChatsRepository : IEntityToEntityRepository<AppUserGroupChat>
{
    Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null);
    Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId);

    Task<IEnumerable<MessagePreviewDto>> GetLatestGroupChatMessagesAsPreviewAsync(Guid appUserId);
    Task<AppUserGroupChat?> GetByAppUserAndGroupChatIdAsync(Guid appUserId, Guid groupChatId);
}
