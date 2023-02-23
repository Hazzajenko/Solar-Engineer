using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Entities;

namespace Messages.API.Repositories.UserGroupChats;

public interface IUserGroupChatsRepository : IGenericRepository<UserGroupChat>
{
    Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null);
    Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId);
}