using Infrastructure.Repositories;
using Messages.API.Data;
using Messages.API.Entities;
using Microsoft.EntityFrameworkCore;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.API.Repositories.UserGroupChats;

public sealed class UserGroupChatsRepository : GenericRepository<MessagesContext, UserGroupChat>,
    IUserGroupChatsRepository
{
    public UserGroupChatsRepository(MessagesContext context) : base(context)
    {
    }

    public async Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, User? user = null)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .Include(x => x.User)
            .Select(x => x.User.Id.ToString())
            .Where(x => user == null || x != user.Id.ToString())
            .ToArrayAsync();
    }
}