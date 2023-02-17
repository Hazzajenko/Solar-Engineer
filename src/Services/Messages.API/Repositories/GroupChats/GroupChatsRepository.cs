using Infrastructure.Repositories;
using Messages.API.Data;
using Messages.API.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.API.Repositories.GroupChats;

public sealed class GroupChatsRepository : GenericRepository<MessagesContext, GroupChat>, IGroupChatsRepository
{
    public GroupChatsRepository(MessagesContext context) : base(context)
    {
    }
}