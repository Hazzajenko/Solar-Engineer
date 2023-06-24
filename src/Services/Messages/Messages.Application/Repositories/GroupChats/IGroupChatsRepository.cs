using Infrastructure.Repositories;
using Messages.Domain.Entities;

namespace Messages.Application.Repositories.GroupChats;

public interface IGroupChatsRepository : IGenericRepository<GroupChat>
{
}