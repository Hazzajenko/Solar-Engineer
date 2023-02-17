using Infrastructure.Repositories;
using Messages.API.Entities;

namespace Messages.API.Repositories.UserGroupChats;

public interface IUserGroupChatsRepository : IGenericRepository<UserGroupChat>
{
    Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, User? user = null);
}