using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Entities;

namespace Messages.API.Repositories.Messages;

public interface IMessagesRepository : IGenericRepository<Message>
{
    Task<IEnumerable<MessageDto>> GetUserMessagesWithUser(User appUser, User recipientUser);
}