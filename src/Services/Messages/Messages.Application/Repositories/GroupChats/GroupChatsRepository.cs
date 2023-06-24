using Infrastructure.Repositories;
using Messages.Application.Data;
using Messages.Domain.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.Application.Repositories.GroupChats;

public sealed class GroupChatsRepository : GenericRepository<MessagesContext, GroupChat>, IGroupChatsRepository
{
    public GroupChatsRepository(MessagesContext context) : base(context)
    {
    }
}